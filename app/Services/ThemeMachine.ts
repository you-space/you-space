import fs from 'fs'
import { promisify } from 'util'
import Application from '@ioc:Adonis/Core/Application'
import Logger from '@ioc:Adonis/Core/Logger'
import View from '@ioc:Adonis/Core/View'
import Video from 'App/Models/Video'
import Comment from 'App/Models/Comment'
import { VideoSerialized, CommentSerialized } from './Origin/types'
import OriginProvider from './Origin/OriginProvider'

const exists = promisify(fs.exists)

interface ThemeDataProvider {
  getThemePath: () => string
  videos: () => Promise<VideoSerialized[]>
  comments: (videoId: string, args: any) => Promise<CommentSerialized[]>
  render: typeof View.render
}

interface ThemeTemplate {
  render: (data: ThemeDataProvider, extras?: any) => Promise<string>
}

export function getThemePath(themeName: string, ...args: string[]) {
  return Application.makePath('content/themes', themeName, ...args)
}

export function getThemeDataProvider(themeName: string): ThemeDataProvider {
  return {
    videos: async (page = 1, limit = 20) => {
      const offset = (page - 1) * limit
      const videos = await Video.query().limit(limit).offset(offset).orderBy('created_at')
      return videos.map((v) => v.serialize())
    },
    comments: async (videoId: string, args: any) => {
      const filters = {
        page: 1,
        limit: 20,
        ...args,
      }

      const offset = (filters.page - 1) * filters.limit

      const video = await Video.findOrFail(videoId)

      // await OriginProvider.registerVideoComments(video.origin, video.videoId, filters.page)

      const comments = await video
        .related('comments')
        .query()
        .preload('user')
        .preload('replies')
        .whereNull('parentCommentId')
        .preload('user')
        .preload('replies')
        .whereNull('parentCommentId')
        .limit(filters.limit)
        .offset(offset)
        .orderBy('created_at')

      return comments.map((c) => OriginProvider.serializeComment(video.origin, c))
    },
    render: (template: string, state?: any) => View.render(template, state),
    getThemePath: (...args) => getThemePath(themeName, ...args),
  }
}

export async function getThemeTemplate(
  themeName: string,
  templateName: string
): Promise<ThemeTemplate> {
  const templatePath = getThemePath(themeName, templateName)

  const templateExist = await exists(`${templatePath}.js`)

  if (templateExist) {
    const template: ThemeTemplate = require(`${templatePath}.js`)
    return template
  }

  Logger.error(`[theme-machine] theme template not found: ${templateName}`)

  return require(getThemePath(themeName, 'index.js'))
}

export async function getThemeMachine() {
  const themeName = 'default-theme'
  const themePath = getThemePath(themeName)
  const themeDataProvider = getThemeDataProvider(themeName)

  const fileExist = await exists(themePath)

  if (!fileExist) {
    throw new Error(`[theme-machine] theme folder not found: ${themeName}`)
  }

  View.mount(themeName, themePath)

  return {
    getTemplate: (template: string) => getThemeTemplate(themeName, template),
    ...themeDataProvider,
  }
}
