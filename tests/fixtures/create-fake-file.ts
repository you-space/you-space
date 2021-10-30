import path from 'path'
import fs from 'fs'
import faker from 'faker'
import axios from 'axios'
import Drive from '@ioc:Adonis/Core/Drive'

async function download(url: string, filename: string) {
  return new Promise<void>(async (resolve, reject) => {
    const response = await axios({
      method: 'GET',
      url,
      responseType: 'stream',
    })

    const stream = response.data.pipe(fs.createWriteStream(filename))

    stream.on('finish', () => {
      stream.close()
      resolve()
    })

    stream.on('error', reject)
  })
}

export async function createFakeImage(fileName: string) {
  const filePath = path.resolve(__dirname, '..', 'data', fileName)

  const exist = await Drive.exists(filePath)

  if (exist) {
    return filePath
  }

  await download(faker.image.imageUrl(), filePath)

  return filePath
}

export async function createFakeVideo(fileName: string) {
  const filePath = path.resolve(__dirname, '..', 'data', fileName)

  const exist = await Drive.exists(filePath)

  if (exist) {
    return filePath
  }

  await download(
    'https://www.pexels.com/pt-br/video/1851190/download/?search_query=space&tracking_id=85idsxbpbrg',
    filePath
  )

  return filePath
}
