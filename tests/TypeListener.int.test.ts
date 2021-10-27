import test from 'japa'
import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'

import Type from 'App/Models/Type'
import { Space } from 'App/Services/SpaceService'
import { TypeFactory } from 'Database/factories'
import Content from 'App/Services/ContentService'

interface Pagination<T = any> {
  meta: any
  data: T[]
}

test.group('TypeListener (int)', (group) => {
  const schemaFilename = Application.tmpPath('schema.js')

  group.before(async () => {
    await Drive.put(schemaFilename, `module.exports = {}`)
  })

  group.after(async () => {
    await Drive.delete(schemaFilename)
  })

  group.beforeEach(async () => {
    const types = await Type.query()

    await Promise.all(types.map((t) => t.delete()))
  })

  test('[type:index] should return list of types in database in', async (assert) => {
    const types = await TypeFactory.createMany(10)

    const result = await Space.emit<Pagination<Type>>('type:index')

    if (!result) {
      assert.isNotNull(result, 'Event should return something')
      return
    }

    assert.deepEqual(
      result.data,
      types.map((t) => t.serialize())
    )
  })

  test('[type:show] should return a type by id', async (assert) => {
    const type = await TypeFactory.create()

    const result = await Space.emit('type:show', type.id)

    assert.isNotNull(result, 'Event should return something')

    assert.deepEqual(type.serialize(), result)
  })

  test('[type:show] should return a type by name', async (assert) => {
    const type = await TypeFactory.create()

    const result = await Space.emit('type:show', type.name)

    assert.isNotNull(result, 'Event should return something')

    assert.deepEqual(type.serialize(), result)
  })

  test('[type:show] should throw an error if type was not found', async (assert) => {
    assert.plan(1)

    await Space.emit('type:show', 'not-exist').catch((err) =>
      assert.equal(err.message, 'type not found')
    )
  })

  test('[type:store] should create a new type', async (assert) => {
    const result = await Space.emit<Type>('type:store', {
      name: 'test-type',
      schema: schemaFilename,
    })

    assert.isNotNull(result, 'Event should return something')

    assert.deepEqual(result?.name, 'test-type')
  })

  test('[type:store] should throw an error if schema filename do not exist', async (assert) => {
    assert.plan(1)

    await Space.emit('type:store', { name: 'err', schema: '/not-exist' }).catch((err) =>
      assert.equal(err.message, 'schema file not found')
    )
  })

  test('[type:store] should create a js file in content/schema folder', async (assert) => {
    const type = await Space.emit<Type>('type:store', {
      name: 'test-type',
      schema: schemaFilename,
    })

    const exist = await Drive.exists(Content.makePath('schemas', `${type?.id}.js`))

    assert.equal(exist, true)
  })

  test('[type:destroy] should delete a type by id', async (assert) => {
    const { id } = await TypeFactory.create()

    await Space.emit('type:destroy', id)

    const type = await Type.find(id)

    assert.isNull(type)
  })

  test('[type:destroy] should delete a type by name', async (assert) => {
    const { name } = await TypeFactory.create()

    await Space.emit('type:destroy', name)

    const type = await Type.findBy('name', name)

    assert.isNull(type)
  })

  test('[type:destroy] should throw an error if type was not found', async (assert) => {
    assert.plan(1)

    await Space.emit('type:destroy', 'no-exist').catch((err) =>
      assert.equal(err.message, 'type not found')
    )
  })
})
