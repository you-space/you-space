import Logger from '@ioc:Adonis/Core/Logger'
import execa from 'execa'
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