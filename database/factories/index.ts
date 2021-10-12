import Application from '@ioc:Adonis/Core/Application'
import Factory from '@ioc:Adonis/Lucid/Factory'
import Drive from '@ioc:Adonis/Core/Drive'

import Item from 'App/Models/Item'
import Type from 'App/Models/Type'

export const ItemFactory = Factory.define(Item, ({ faker }) => {
  return {
    value: {
      title: faker.name.title(),
    },
  }
}).build()

export const TypeFactory = Factory.define(Type, ({ faker }) => {
  return {
    name: faker.name.firstName(),
    options: {},
    deletedAt: null,
  }
})
  .relation('items', () => ItemFactory)
  .after('create', async (_, type) => {
    return Drive.put(
      Application.makePath('content', 'schemas', `${type.id}.js`),
      'module.exports = { title: { type: "string" } }'
    )
  })
  .build()
