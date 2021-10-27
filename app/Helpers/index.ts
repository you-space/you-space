import execa from 'execa'
import fs from 'fs'

import SessionConfig from 'Config/session'
import AdonisRequest from '@ioc:Adonis/Core/Request'
import Encryption from '@ioc:Adonis/Core/Encryption'
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
  try {
    const file = await import(path)

    return file.default || file
  } catch (error) {
    Logger.error(error)
    return null
  }
}

export async function isGitUrl(url: string) {
  try {
    await execa('git', ['ls-remote', url])
    return true
  } catch (error) {
    return false
  }
}

export const getSocketUserId = (socket) => {
  // @ts-ignore
  const SocketRequest = new AdonisRequest(socket.request, null, Encryption, {})
  const sessionId = SocketRequest.cookie(SessionConfig.cookieName)

  if (!sessionId) {
    return null
  }

  const session = SocketRequest.encryptedCookie(sessionId)

  if (!session || !session.auth_web) {
    return null
  }

  return session.auth_web
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
