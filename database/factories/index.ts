import Factory from '@ioc:Adonis/Lucid/Factory'

import Item from 'App/Models/Item'
import Type from 'App/Models/Type'

export const ItemFactory = Factory.define(Item, ({ faker }) => ({
  sourceId: faker.datatype.uuid(),
  value: {},
})).build()

export const TypeFactory = Factory.define(Type, ({ faker }) => ({
  name: faker.name.firstName(),
  options: {},
  deletedAt: null,
}))
  .relation('items', () => ItemFactory)
  .build()
