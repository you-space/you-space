import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import Logger from '@ioc:Adonis/Core/Logger'
import { Job } from 'App/Queue'

interface Payload {
  filename: string
  file: MultipartFileContract
}

export async function worker(job: Job<Payload>) {
  const { file, filename } = job.args

  const start = Date.now()

  Logger.debug(`[upload] start uploading ${filename}`)

  await file.moveToDisk('./', {
    name: filename,
    contentType: file.headers['content-type'],
  })

  Logger.child({ duration: Date.now() - start }).debug(`[upload] upload finished for ${filename}`)
}

export default worker
