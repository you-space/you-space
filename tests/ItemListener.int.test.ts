import test from 'japa'
import faker from 'faker'

import Item from 'App/Models/Item'
import Type from 'App/Models/Type'
import Space from 'App/Services/SpaceService'
import { ItemFactory, TypeFactory } from 'Database/factories'

interface IndexResult {
  meta: any
  data: Item[]
}

test.group('ItemListener (int)', (group) => {
  let type: Type

  group.before(async () => {
    type = await TypeFactory.create()
  })

  group.after(async () => {
    await type.delete()
  })

  group.beforeEach(async () => {
    await Item.query().delete()
  })

  test('[item:index] should return list of items', async (assert) => {
    const items = await ItemFactory.createMany(20, (model) => {
      model.typeId = type.id
    })

    const result = await Space.emit<IndexResult>('item:index')

    if (!result) {
      assert.isNotNull(result, 'Event should return something')
      return
    }

    assert.deepEqual(
      result.data,
      items.map((i) => i.serializeByTypeSchema())
    )
  })

  test('[item:index] should result include requested relations', async (assert) => {
    await ItemFactory.createMany(20, (model) => {
      model.typeId = type.id
    })

    const result = await Space.emit<IndexResult>('item:index', {
      include: 'type,visibility',
    })

    if (!result) {
      assert.isNotNull(result, 'Event should return something')
      return
    }

    const haveType = result.data.every((i) => !!i.type)
    const haveVisibility = result.data.every((i) => !!i.visibility)

    assert.equal(haveType, true, 'All items must have type')
    assert.equal(haveVisibility, true, 'All items must have visibility')
  })

  test('[item:index] should result return raw items', async (assert) => {
    await ItemFactory.createMany(20, (model) => {
      model.typeId = type.id
    })

    const items = await Item.query()

    const result = await Space.emit<IndexResult>('item:index', {
      raw: true,
    })

    if (!result) {
      assert.isNotNull(result, 'Event should return something')
      return
    }

    assert.deepEqual(
      result.data,
      items.map((i) => i.serialize())
    )
  })

  test('[item:store] should create a new item', async (assert) => {
    const data = {
      type: type.name,
      value: {
        title: faker.name.title(),
      },
    }

    const result = await Space.emit<Item>('item:store', data)

    if (!result) {
      assert.isNotNull(result, 'Event should return something')
      return
    }

    const item = await Item.findOrFail(result.id)

    assert.deepEqual(item.value, data.value)
  })

  test('[item:store] should throw an error if type was not found', async (assert) => {
    assert.plan(1)

    await Space.emit<Item>('item:store', { type: 'not-exist', value: {} }).catch((err) =>
      assert.equal(err.message, 'type not found')
    )
  })

  test('[item:store] should throw an error if type schema was not found', async (assert) => {
    assert.plan(1)

    const type = await Type.create({ name: 'no-schema' })

    await Space.emit<Item>('item:store', { type: type.name, value: {} }).catch((err) =>
      assert.equal(err.message, 'type schema not found')
    )
  })

  test('[item:store] should validate item.value data based in type schema', async (assert) => {
    assert.plan(1)

    await Space.emit<Item>('item:store', { type: type.name, value: {} }).catch((err) =>
      assert.deepEqual(err.messages, { title: ['required validation failed'] })
    )
  })

  test('[item:update] should update an item', async (assert) => {
    const item = await ItemFactory.create((model) => {
      model.typeId = type.id
      model.value = {
        title: 'old-title',
      }
    })

    await Space.emit('item:update', {
      id: item.id,
      value: {
        title: 'new-title',
      },
    })

    await item.refresh()

    assert.deepEqual(item.value, { title: 'new-title' })
  })

  test('[item:update] should throw an error if item was not found', async (assert) => {
    assert.plan(1)

    const data = {
      id: 77,
      value: {
        title: 'new-title',
      },
    }

    await Space.emit('item:update', data).catch((err) =>
      assert.equal(err.message, 'item not found')
    )
  })

  test('[item:update] should throw an error if type schema was not found', async (assert) => {
    assert.plan(1)

    const type = await Type.create({ name: 'any' })

    const { id } = await ItemFactory.create((model) => {
      model.typeId = type.id
    })

    const data = {
      id: id,
      value: {},
    }

    await Space.emit('item:update', data).catch((err) =>
      assert.equal(err.message, 'type schema not found')
    )
  })

  test('[item:update] should validate item.value data based in type schema', async (assert) => {
    assert.plan(1)

    const { id } = await ItemFactory.create((model) => {
      model.typeId = type.id
    })

    const data = {
      id,
      value: {},
    }

    await Space.emit<Item>('item:update', data).catch((err) =>
      assert.deepEqual(err.messages, { title: ['required validation failed'] })
    )
  })

  test('[item:destroy] should delete an item', async (assert) => {
    const { id } = await ItemFactory.create((model) => {
      model.typeId = type.id
    })

    await Space.emit('item:destroy', id)

    const item = await Item.find(id)

    assert.isNull(item, 'Should item be deleted')
  })

  test('[item:destroy] should throw an error if item was not found', async (assert) => {
    assert.plan(1)

    await Space.emit('item:destroy', 8).catch((err) => assert.equal(err.message, 'item not found'))
  })
})
