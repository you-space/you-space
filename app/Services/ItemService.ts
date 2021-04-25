import fs from 'fs'
import { promisify } from 'util'
import Application from '@ioc:Adonis/Core/Application'
import Item from 'App/Models/Item'
import Permission from 'App/Models/Permission'
import User from 'App/Models/User'
import Visibility from 'App/Models/Visibility'
import YsOption, { BaseOptions } from 'App/Models/YsOption'
import lodash from 'lodash'

export interface ItemFilters {
  page: number
  limit: number

  search?: string
  visibility?: string
  entity?: string
  originId?: string

  serializeItems: boolean

  orderBy: [string, 'asc' | 'desc']
}

interface Provider {
  name: string
  path: string
}

export default class ItemService {
  public async getUserAllowedVisibilities(user?: User) {
    const allVisibility = await Visibility.query().preload('requiredPermissions')

    if (!user) {
      return allVisibility.filter((v) => v.name === 'public')
    }

    const roles = await user.related('roles').query().preload('permissions')

    const usersPermission = roles
      .map((r) => r.permissions)
      .reduce<Permission[]>((all, p) => all.concat(p), [])
      .map((p) => p.name)

    const allowedVisibilities = allVisibility.filter((v) => {
      const requiredPermissions = v.requiredPermissions.map((p) => p.name)

      if (requiredPermissions.length === 0) {
        return true
      }
      return requiredPermissions.every((rp) => usersPermission.includes(rp))
    })

    return allowedVisibilities
  }

  public async getProviders() {
    const option = await YsOption.findByOrFail('name', BaseOptions.RegisteredContentProviders)
    const allProviders = option.value as Provider[]
    const instances = {}

    await Promise.all(
      allProviders.map(async (p) => {
        const providerPath = Application.makePath('content', 'plugins', p.path)

        const exists = await promisify(fs.exists)(providerPath)

        if (!exists) {
          return null
        }

        const classObject = (await import(providerPath)).default
        instances[p.name] = new classObject()
      })
    )

    return instances
  }

  public async getItems(args?: Partial<ItemFilters>, user?: User) {
    const filters: ItemFilters = {
      orderBy: ['created_at', 'desc'],
      serializeItems: true,
      page: 1,
      limit: 20,
      ...args,
    }

    const allowedVisibility = await this.getUserAllowedVisibilities(user)

    const visibilityId = allowedVisibility
      .filter((v) => {
        if (!filters.visibility) {
          return true
        }
        return filters.visibility.split(',').includes(v.name)
      })
      .map((v) => v.id)

    const providers = await this.getProviders()

    const query = Item.query()
      .select('items.*')
      .leftJoin('item_metas', 'item_metas.item_id', 'items.id')
      .preload('metas')
      .preload('provider')
      .preload('visibility')
      .preload('provider', (q) => {
        q.preload('origin')
      })
      .whereHas('provider', (q) => q.where('active', true))
      .whereIn('visibility_id', visibilityId)
      .orderBy(filters.orderBy[0], filters.orderBy[1])
      .groupBy('items.id')

    if (filters.search) {
      query.whereRaw(
        `setweight(to_tsvector(coalesce(items.value::text, '')), 'A')
          || setweight(to_tsvector(coalesce(item_metas.value, '')), 'B')
          @@ plainto_tsquery(?)`,
        [filters.search]
      )
    }

    if (filters.entity) {
      query.whereHas('entity', (q) =>
        q.whereIn('name', lodash.get(filters, 'entity', '').split(','))
      )
    }

    if (filters.originId) {
      query.whereHas('provider', (q) =>
        q.whereIn('origin_id', lodash.get(filters, 'originId', '').split(','))
      )
    }

    const paginator = await query.paginate(filters.page, filters.limit)

    const serialize = paginator.all().map((item) => {
      const itemProvider = providers[item.provider.name]
      let value = item.value

      if (itemProvider && itemProvider.serialize && filters.serializeItems) {
        value = itemProvider.serialize(item.value)
      }

      return {
        id: item.id,
        sourceId: item.sourceId,
        entityId: item.entityId,
        parentId: item.parentId,

        originName: item.provider.origin.name,
        originId: item.provider.origin.id,

        visibilityId: item.visibility.id,
        visibilityName: item.visibility.name,

        value,
      }
    })

    return {
      data: serialize,
      meta: paginator.getMeta(),
    }
  }
}
