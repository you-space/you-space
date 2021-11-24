import test from 'japa'
import Image from 'App/Models/Image'
import Space from 'App/Services/SpaceService'
import { ImageFactory } from 'Database/factories'

interface IndexResult {
  meta: any
  data: Image[]
}

test.group('ImageListener (int)', (group) => {
  group.beforeEach(async () => {
    await Image.query().delete()
  })

  test('[image:index] should return list of images', async (assert) => {
    const images = await ImageFactory.createMany(5)

    const result = await Space.emit<IndexResult>('image:index')

    if (!result) {
      assert.fail('Event should return something')
      return
    }

    assert.deepEqual(
      result.data,
      images.map((image) => image.serialize())
    )
  })

  test('[image:store] should create a image', async (assert) => {
    const payload = (await ImageFactory.make()).serialize()

    await Space.emit('image:store', payload)

    const image = await Image.query().first()

    if (!image) {
      assert.fail('Image should be created')
      return
    }

    assert.deepEqual(
      image.serialize({
        fields: Object.keys(payload),
      }),
      payload
    )
  })

  test('[image:show] should return a image by id', async (assert) => {
    const image = await ImageFactory.create()

    const result = await Space.emit<Image>('image:show', { id: image.id })

    if (!result) {
      assert.fail('Event should return something')
      return
    }

    assert.deepEqual(image.serialize(), result)
  })

  test('[image:update] should update a images', async (assert) => {
    const image = await ImageFactory.create()

    const alt = 'change image alt title'

    await Space.emit<Image>('image:update', { id: image.id, alt })

    await image.refresh()

    assert.equal(image.alt, alt)
  })

  test('[image:destroy] should delete a images', async (assert) => {
    const { id } = await ImageFactory.create()

    await Space.emit<Image>('image:destroy', id)

    const image = await Image.find(id)

    assert.isNull(image)
  })

  test('[image:destroy] should trigger a error if image was not found', async (assert) => {
    assert.plan(1)

    await Space.emit<Image>('image:destroy', 1).catch((err) =>
      assert.equal(err.message, 'E_ROW_NOT_FOUND: Row not found')
    )
  })
})
