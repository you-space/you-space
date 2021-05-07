import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ItemType from 'App/Models/ItemType'

export default class ItemTypeSeeder extends BaseSeeder {
  public async run() {
    await ItemType.fetchOrCreateMany('name', [
      {
        name: 'video',
      },
      {
        name: 'comment',
      },
    ])
  }
}
