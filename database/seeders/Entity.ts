import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Entity from 'App/Models/Entity'

export default class EntitySeeder extends BaseSeeder {
  public async run() {
    await Entity.fetchOrCreateMany('name', [
      {
        name: 'video',
      },
      {
        name: 'comment',
      },
    ])
  }
}
