import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
// import path from 'path'
// import Drive from '@ioc:Adonis/Core/Drive'
// import faker from 'faker'

// import Content from 'App/Services/ContentService'

export default class TypeYoutubeVideoSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    // const type = await Type.updateOrCreate({ name: 'youtube-videos' }, { name: 'youtube-videos' })
    // const schema = Content.makePath('schemas', `${type.id}.js`)
    // await ItemFactory.createMany(100, (model) => {
    //   model.typeId = type.id
    //   model.value = {
    //     src: 'https://www.youtube.com/watch?v=gEOa793e_dU',
    //     snippet: {
    //       title: faker.name.title(),
    //       description: faker.lorem.paragraphs(5),
    //       publishedAt: faker.date.past(),
    //       tags: faker.random.arrayElements(
    //         [
    //           'space',
    //           'nasa',
    //           'moon',
    //           'mars',
    //           'venus',
    //           'satellite',
    //           'sun',
    //           'earth',
    //           'netuno',
    //           'jupiter',
    //         ],
    //         4
    //       ),
    //       thumbnails: {
    //         high: {
    //           url: faker.random.arrayElement([
    //             'https://i.ytimg.com/vi/gEOa793e_dU/hqdefault.jpg',
    //             'https://i.ytimg.com/vi/NwSISlnoy9w/hqdefault.jpg',
    //             'https://i.ytimg.com/vi/LlvHN18NQUM/hqdefault.jpg',
    //             'https://i.ytimg.com/vi/n_aI22YkGVU/hqdefault.jpg',
    //             'https://i.ytimg.com/vi/Oq5UNqtN1a8/hqdefault.jpg',
    //             'https://i.ytimg.com/vi/C0qcstDJErk/hqdefault.jpg',
    //             'https://i.ytimg.com/vi/RKLGK8Co0Xo/hqdefault.jpg',
    //             'https://i.ytimg.com/vi/3tOP7olHDmU/hqdefault.jpg',
    //             'https://i.ytimg.com/vi/35ANRDXESqw/hqdefault.jpg',
    //             'https://i.ytimg.com/vi/wFsQvxSzsA8/hqdefault.jpg',
    //             'https://i.ytimg.com/vi/ors0wpcVDcc/hqdefault.jpg',
    //             'https://i.ytimg.com/vi/-YUYLbjl7Sk/hqdefault.jpg',
    //           ]),
    //         },
    //       },
    //     },
    //     statistics: {
    //       viewCount: faker.datatype.number({ min: 1, max: 1000000 }),
    //       likeCount: faker.datatype.number({ min: 1, max: 1000000 }),
    //     },
    //     contentDetails: {
    //       duration: `PT${faker.datatype.number(59)}M${faker.datatype.number(59)}S`,
    //     },
    //   }
    // })
    // await Drive.copy(path.resolve(__dirname, 'schemas', 'youtube-videos.js'), schema)
  }
}
