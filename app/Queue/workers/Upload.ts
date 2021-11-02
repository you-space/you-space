import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import Logger from '@ioc:Adonis/Core/Logger'

interface Payload {
  filename: string
  file: MultipartFileContract
}

export async function worker({ file, filename }: Payload) {
  const start = Date.now()

  Logger.debug(`[upload] start uploading ${filename}`)

  await file.moveToDisk('./', {
    name: filename,
    contentType: file.headers['content-type'],
  })

  Logger.child({ duration: Date.now() - start }).debug(`[upload] upload finished for ${filename}`)
}

export default worker
