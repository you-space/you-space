import test from 'japa'
import Space from './Space'
import faker from 'faker'
import sinon from 'sinon'

test.group('Space.ts (unit)', (group) => {
  group.beforeEach(() => {
    Space.cleanHandlers()
    Space.roles = ['*']
  })

  test('should register event handler', async (assert) => {
    const result = faker.lorem.lines(2)

    const handler = {
      name: 'teste',
      handler: () => result,
    }

    Space.registerHandler(handler)

    assert.deepInclude(Space.fetchHandlers(), handler)
  })

  test('should listener be called with emit args', async () => {
    const random = faker.lorem.lines(2)
    const callback = sinon.spy()

    Space.on('teste', callback)

    await Space.emit('teste', random)

    sinon.assert.calledOnceWithExactly(callback, random)
  })

  test('should event with handler return a result', async (assert) => {
    const result = faker.lorem.lines(2)

    Space.registerHandler({
      name: 'teste',
      handler: () => result,
    })

    const emit = await Space.emit('teste')

    assert.equal(emit, result)
  })

  test('should event not be emitted when user do not have permissions', async (assert) => {
    assert.plan(1)

    const random = faker.lorem.lines(2)
    const callback = sinon.spy()

    const handler = {
      name: 'teste',
      roles: ['admin'],
      handler: callback,
    }

    Space.registerHandler(handler)

    Space.on('teste', callback)

    Space.roles = ['not-admin']

    await Space.emit('teste', random).catch((err) => assert.equal(err.message, 'Not Allowed'))
  })
})
