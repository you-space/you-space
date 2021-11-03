import execa from 'execa'
import fs from 'fs'
import path from 'path'

import Drive from '@ioc:Adonis/Core/Drive'

import Logger from '@ioc:Adonis/Core/Logger'

export function isJson(str: string) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

export function requireIfExist(path: string) {
  try {
    return require(path)
  } catch (error) {
    return null
  }
}

export async function importIfExist(path: string) {
  return import(path).then((m) => m.default).catch(() => null)
}

export async function readIfExist(path: string) {
  const exists = await Drive.exists(path)

  if (exists) {
    return fs.readFileSync(path, 'utf8')
  }

  return null
}

export async function isGitUrl(url: string) {
  return execa('git', ['ls-remote', url])
    .catch(() => false)
    .then(() => true)
}

export async function listFolder(path: string): Promise<string[]> {
  return fs.promises
    .readdir(path, { withFileTypes: true })
    .then((files) => files.filter((f) => f.isDirectory()).map((f) => f.name))
    .catch((error) => {
      Logger.error(error)
      return []
    })
}

export async function findConfig(folderPath: string) {
  const jsonConfig = await readIfExist(path.join(folderPath, 'space.config.json'))

  if (jsonConfig && isJson(jsonConfig)) {
    return JSON.parse(jsonConfig)
  }

  return {}
}
