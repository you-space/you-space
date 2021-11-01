import Space from 'App/Services/SpaceService'
import { CommentFactory, VideoFactory } from 'Database/factories'
import test from 'japa'
import Comment from 'App/Models/Comment'

interface IndexResult {
  meta: any
  data: Comment[]
}

test.group('CommentListener (int)', (group) => {
  group.beforeEach(async () => {
    await Comment.query().delete()
  })

  test('[comment:index] should return a list of comments', async (assert) => {
    await VideoFactory.with('comments', 5).create()

    const comments = await Comment.query().orderBy('created_at', 'asc')

    const result = await Space.emit<IndexResult>('comment:index')

    if (!result) {
      assert.fail('Event should return something')
      return
    }

    assert.deepEqual(
      result.data,
      comments.map((c) => c.serialize())
    )
  })

  test('[comment:show] should return a comment by id', async (assert) => {
    await VideoFactory.with('comments', 5).create()

    const comment = await Comment.query().firstOrFail()

    const result = await Space.emit<Comment>('comment:show', {
      id: comment.id,
    })

    if (!result) {
      assert.fail('Event should return something')
      return
    }

    assert.deepEqual(comment.serialize(), result)
  })

  test('[comment:show] should trigger a error if comment was not found', async (assert) => {
    assert.plan(1)

    await Space.emit<Comment>('comment:show', { id: 1 }).catch((err) =>
      assert.equal(err.message, 'E_ROW_NOT_FOUND: Row not found')
    )
  })

  test('[comment:store] should create a comment', async (assert) => {
    const video = await VideoFactory.create()

    const { username, avatarSrc, content } = await CommentFactory.make()

    const data = {
      username,
      avatarSrc,
      content,
      videoId: video.id,
    }

    const result = await Space.emit<Record<string, any>>('comment:store', data)

    if (!result) {
      assert.fail('Event should return something')
      return
    }

    assert.equal(result.username, data.username)
    assert.equal(result.content, data.content)
    assert.equal(result.videoId, data.videoId)
  })

  test('[comment:update] should update a comment', async (assert) => {
    const { comments } = await VideoFactory.with('comments', 5).create()

    const content = 'update content'

    await Space.emit<Record<string, any>>('comment:update', {
      id: comments[0].id,
      content,
    })

    const comment = await Comment.findOrFail(comments[0].id)

    assert.deepEqual(comment.content, content)
  })

  test('[comment:update] should trigger a error if comment was not found', async (assert) => {
    assert.plan(1)

    await Space.emit<Record<string, any>>('comment:update', { id: 1 }).catch((err) =>
      assert.equal(err.message, 'E_ROW_NOT_FOUND: Row not found')
    )
  })

  test('[comment:destroy] should delete a comment', async (assert) => {
    await VideoFactory.with('comments', 1).create()

    const comment = await Comment.query().firstOrFail()

    await Space.emit('comment:destroy', comment.id)

    const result = await Comment.find(comment.id)

    assert.isNull(result)
  })

  test('[comment:destroy] should trigger a error if comment was not found', async (assert) => {
    await Space.emit('comment:destroy', 1).catch((err) =>
      assert.equal(err.message, 'E_ROW_NOT_FOUND: Row not found')
    )
  })
})
