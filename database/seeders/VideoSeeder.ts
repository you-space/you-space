import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import VideoImage from 'App/Models/VideoImage'
import { ImageFactory, VideoFactory } from 'Database/factories'

export default class VideoSeederSeeder extends BaseSeeder {
  public async run() {
    const videos = await VideoFactory.createMany(100)

    const images = await ImageFactory.createMany(100, (m) => {
      m.name = 'thumbnail-default'
    })

    await VideoImage.updateOrCreateMany(
      ['imageId', 'videoId'],
      videos.map((video, index) => ({
        imageId: images[index].id,
        videoId: video.id,
      }))
    )
  }
}
