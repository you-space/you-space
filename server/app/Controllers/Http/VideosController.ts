import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import fs from 'fs'
import { promisify } from 'util'
import { getVideoDurationInSeconds } from 'get-video-duration'

import Video from 'App/Models/Video'

const registerVisualizations: any[] = []

export default class VideosController {
  public async getTrendingVideos() {
    const videos = await Video.query()
      .has('visualizations')
      .preload('visualizations')
      .select('videos.*', 'video_visualizations.count', 'video_visualizations.video_id')
      .leftJoin('video_visualizations', 'videos.id', 'video_visualizations.video_id')
      .orderBy('video_visualizations.count', 'desc')
      .limit(3)

    return videos.map((video) => ({
      id: video.id,
      name: video.name,
      hasThumbnail: !!video.filenameThumbnail,
      visualizations: video.visualizations.count,
    }))
  }

  public async userRecommendations() {
    return Video.all()
  }

  public async userSubscriptions() {
    return Video.all()
  }

  public async showThumbnail({ params, response }: HttpContextContract) {
    const video = await Video.findOrFail(params.videoId)

    const thumbnailPath = `${Application.tmpPath('thumbnails')}/${video.filenameThumbnail}`

    const readFile = promisify(fs.readFile)

    response.safeHeader('Content-type', 'image')

    return readFile(thumbnailPath)
  }

  public async show({ params, response, request }: HttpContextContract) {
    const video = await Video.findOrFail(params.id)

    const videoPath = `${Application.tmpPath('videos')}/${video.filename}`

    const readFile = promisify(fs.readFile)

    const haveRegistered = registerVisualizations.some(
      (r) => r.videoId === video.id && r.ip === request.ip()
    )

    if (!haveRegistered) {
      const visualizations = await video.related('visualizations').firstOrCreate(
        {},
        {
          count: 0,
        }
      )

      visualizations.count = visualizations.count + 1

      await visualizations.save()

      const register = {
        videoId: video.id,
        ip: request.ip(),
      }

      registerVisualizations.push(register)

      const index = registerVisualizations.indexOf(register)

      const videoDuration = await getVideoDurationInSeconds(videoPath)

      const timeout = videoDuration * 1000

      setTimeout(() => registerVisualizations.splice(index, 1), timeout)
    }

    response.safeHeader('Content-type', `video/${video.extname}`)

    return readFile(videoPath)
  }
}
