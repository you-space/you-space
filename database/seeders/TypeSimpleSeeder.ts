import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'
import path from 'path'
import faker from 'faker'

import { ItemFactory } from 'Database/factories'
import Type from 'App/Models/Type'

export default class TypeSimpleSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const type = await Type.updateOrCreate({ name: 'simple' }, { name: 'simple' })
    const schema = Application.makePath('content', 'schemas', `${type.id}.js`)

    await ItemFactory.createMany(10, (model) => {
      model.typeId = type.id
      model.value = {
        title: faker.name.title(),
      }
    })

    await Drive.copy(path.resolve(__dirname, 'schemas', 'simple.js'), schema)
  }
}
