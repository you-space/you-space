import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Application from '@ioc:Adonis/Core/Application'
import path from 'path'
import Drive from '@ioc:Adonis/Core/Drive'
import faker from 'faker'

import Type from 'App/Models/Type'
import { ItemFactory } from 'Database/factories'

export default class TypeYoutubeVideoSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const type = await Type.updateOrCreate({ name: 'youtube-videos' }, { name: 'youtube-videos' })
    const schema = Application.makePath('content', 'schemas', `${type.id}.js`)

    await ItemFactory.createMany(10, (model) => {
      model.typeId = type.id
      model.value = {
        src: 'https://www.youtube.com/watch?v=gEOa793e_dU',
        snippet: {
          title: faker.name.title(),
          description: faker.lorem.paragraphs(5),
          publishedAt: faker.date.past(),
          thumbnails: {
            high: {
              url: faker.image.imageUrl(),
            },
          },
        },
        statistics: {
          viewCount: faker.datatype.number({ min: 1, max: 1000000 }),
          likeCount: faker.datatype.number({ min: 1, max: 1000000 }),
        },
      }
    })

    await Drive.copy(path.resolve(__dirname, 'schemas', 'youtube-videos.js'), schema)
  }
}
