import Factory from '@ioc:Adonis/Lucid/Factory'
import Image from 'App/Models/Image'
import Video from 'App/Models/Video'
import { DateTime } from 'luxon'
import View from 'App/Models/View'
import Comment from 'App/Models/Comment'

export const ImageFactory = Factory.define(Image, ({ faker }) => {
  return {
    name: faker.name.title(),
    src: faker.image.imageUrl(),
    alt: faker.lorem.sentence(),
    source: 'unknown',
    videoId: null,
  }
}).build()

export const ViewFactory = Factory.define(View, ({ faker }) => {
  return {
    count: faker.datatype.number(),
    source: 'unknown',
  }
}).build()

export const CommentFactory = Factory.define(Comment, ({ faker }) => {
  return {
    source: 'unknown',
    sourceId: null,
    parentId: null,
    content: faker.lorem.sentence(),
    username: faker.internet.userName(),
    avatarSrc: faker.image.avatar(),
    publishedAt: DateTime.fromJSDate(faker.date.past()),
  }
}).build()

export const VideoFactory = Factory.define(Video, ({ faker }) => {
  const youtubeId = faker.random.arrayElement([
    '6stlCkUDG_s',
    'gsnqXt7d1mU',
    'eg2g6FPsdLI',
    '4N8oOj_aue8',
    'oe70Uhjc_F4&list',
    'HccqokXN2n8',
    'Jh6jZftn2e0',
    'HHBsvKnCkwI',
    'NpdQkEPELh4',
    'ZjbFDYoE-OY',
  ])

  const title = faker.name.title()

  return {
    src: `https://www.youtube.com/embed/${youtubeId}`,
    sourceId: youtubeId,
    title,
    source: 'unknown',
    description: faker.lorem.sentence(),
    slug: faker.datatype.uuid(),
    publishedAt: DateTime.fromJSDate(faker.date.past()),
    raw: {},
  }
})
  .relation('images', () => ImageFactory)
  .relation('views', () => ViewFactory)
  .relation('comments', () => CommentFactory)
  .build()
