import View from 'App/Models/View'
import Space from 'App/Services/SpaceService'
import { VideoFactory, ViewFactory } from 'Database/factories'
import test from 'japa'

interface IndexResult {
  meta: any
  data: View[]
}

test.group('ViewListener (int)', (group) => {
  group.beforeEach(async () => {
    await View.query().delete()
  })

  test('[view:index] should return a list of views', async (assert) => {
    const video = await VideoFactory.create()

    const views = await ViewFactory.createMany(5, (m) => (m.videoId = video.id))

    const result = await Space.emit<IndexResult>('view:index')

    if (!result) {
      assert.fail('Event should return something')
      return
    }

    assert.deepEqual(
      result.data,
      views.map((m) => m.serialize())
    )
  })

  test('[view:show] should return view by id', async (assert) => {
    const video = await VideoFactory.create()

    const view = await ViewFactory.create((m) => (m.videoId = video.id))

    const result = await Space.emit<View>('view:show', {
      id: view.id,
    })

    if (!result) {
      assert.fail('Event should return something')
      return
    }

    assert.deepEqual(result, view.serialize())
  })

  test('[view:store] should create a view', async (assert) => {
    const video = await VideoFactory.create()

    const data = {
      videoId: video.id,
      count: 8,
    }

    const result = await Space.emit<Record<string, any>>('view:store', data)

    if (!result) {
      assert.fail('Event should return something')
      return
    }

    assert.equal(result.videoId, data.videoId)
    assert.equal(result.count, data.count)
  })

  test('[view:update] should update a view', async (assert) => {
    const video = await VideoFactory.create()

    const { id } = await ViewFactory.create((m) => (m.videoId = video.id))

    const source = 'update source'

    await Space.emit<View>('view:update', {
      id,
      source,
    })

    const view = await View.findOrFail(id)

    assert.deepEqual(view.source, source)
  })

  test('[view:update] should trigger a error if view was not found', async (assert) => {
    assert.plan(1)

    await Space.emit<View>('view:update', { id: 1 }).catch((e) => {
      assert.equal(e.message, 'E_ROW_NOT_FOUND: Row not found')
    })
  })

  test('[view:destroy] should delete a view', async (assert) => {
    const video = await VideoFactory.create()

    const { id } = await ViewFactory.create((m) => (m.videoId = video.id))

    await Space.emit('view:destroy', id)

    const views = await View.all()

    assert.equal(views.length, 0)
  })

  test('[view:destroy] should trigger a error if view was not found', async (assert) => {
    assert.plan(1)

    await Space.emit<View>('view:destroy', 1).catch((e) => {
      assert.equal(e.message, 'E_ROW_NOT_FOUND: Row not found')
    })
  })
})
