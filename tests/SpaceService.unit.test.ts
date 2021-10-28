import test from 'japa'
import { Space } from 'App/Services/SpaceService'
import faker from 'faker'
import sinon from 'sinon'

test.group('SpaceService.ts (unit)', (group) => {
  const eventName = 'test'

  group.beforeEach(() => {
    Space.off(eventName)
  })

  test.skip('should register event handler', async (assert) => {
    const result = faker.lorem.lines(2)

    const handler = () => result

    Space.setHandler(eventName, handler)

    assert.deepInclude(Space.findEvent(eventName), handler)
  })

  test.skip('should listener be called with emit args', async () => {
    const random = faker.lorem.lines(2)
    const callback = sinon.spy()

    Space.on(eventName, callback)

    await Space.emit(eventName, random)

    sinon.assert.calledOnceWithExactly(callback, random)
  })

  test.skip('should event with handler return a result', async (assert) => {
    const result = faker.lorem.lines(2)

    Space.setHandler(eventName, () => result)

    const emit = await Space.emit(eventName)

    assert.equal(emit, result)
  })
})
