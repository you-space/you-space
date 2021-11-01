import { validator } from '@ioc:Adonis/Core/Validator'
import View from 'App/Models/View'
import ViewIndexValidator from 'App/Validators/ViewIndexValidator'
import ViewShowValidator from 'App/Validators/ViewShowValidator'
import ViewStoreValidator from 'App/Validators/ViewStoreValidator'
import ViewUpdateValidator from 'App/Validators/ViewUpdateValidator'

export default class ViewListener {
  public async index(payload: any) {
    const filters = await validator.validate({
      ...new ViewIndexValidator(),
      data: payload || {},
    })

    const query = View.query()

    if (filters.fields) {
      query.select(filters.fields)
    }

    query.orderBy(filters.order_by || 'created_at', filters.order_desc ? 'desc' : 'asc')

    const pagination = await query.paginate(filters.page || 1, filters.limit || 20)

    return pagination.serialize()
  }

  public async show(payload: any) {
    const { id } = await validator.validate({
      ...new ViewShowValidator(),
      data: payload || {},
    })

    const view = await View.findOrFail(id)

    return view.serialize()
  }

  public async store(payload: any) {
    const data = await validator.validate({
      ...new ViewStoreValidator(),
      data: payload || {},
    })

    const view = await View.create(data)

    return view.serialize()
  }

  public async update(payload: any) {
    const { id, ...data } = await validator.validate({
      ...new ViewUpdateValidator(),
      data: payload || {},
    })

    const view = await View.findOrFail(id)

    view.merge(data)

    await view.save()

    return view.serialize()
  }

  public async destroy(id: number) {
    const view = await View.findOrFail(id)

    await view.delete()
  }
}
