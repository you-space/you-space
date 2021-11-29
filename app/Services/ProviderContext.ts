import axios from 'axios'
import lodash from 'lodash'

import VideoRepository from 'App/Repositories/VideoRepository'
import Logger from '@ioc:Adonis/Core/Logger'

export class ProviderContext {
  public videosRepository = VideoRepository

  public config: Record<string, any> = {}
  public axios = axios
  public lodash = lodash
  public logger = Logger
}
