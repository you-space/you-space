import test from 'japa'
import Space from './Space'
import faker from 'faker'
import sinon from 'sinon'

test.group('Space.ts (unit)', (group) => {
  group.beforeEach(() => {
    Space.offAll()
  })

  test('should register event handler', async (assert) => {
    const result = faker.lorem.lines(2)

    const handler = () => result

    Space.setHandler('teste', handler)

    assert.deepInclude(Space.findEvent('teste'), handler)
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

    Space.setHandler('teste', () => result)

    const emit = await Space.emit('teste')

    assert.equal(emit, result)
  })
})
