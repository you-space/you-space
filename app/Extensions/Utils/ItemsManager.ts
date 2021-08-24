import Item from 'App/Models/Item'
import Type from 'App/Models/Type'

export default class ItemsManager {
  public async createMany(typeName: string, items: Partial<Item>[]) {
    const type = await Type.query().where('name', typeName).whereNull('deletedAt').first()

    if (!type) {
      throw new Error('type not found')
    }

    type.related('items').updateOrCreateMany(
      items.map((item) => ({
        sourceId: item.sourceId,
        value: item.value,
      })),
      ['sourceId', 'typeId']
    )
  }
}
