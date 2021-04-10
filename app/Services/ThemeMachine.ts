import fs from 'fs'
import Application from '@ioc:Adonis/Core/Application'
import { promisify } from 'util'

export function getThemePath(themeName: string, ...args: string[]) {
  return Application.makePath('content/themes', themeName, ...args)
}

export async function getThemeMachine() {
  const themeName = 'revolution'
  const themePath = getThemePath(themeName)

  const fileExist = await promisify(fs.exists)(themePath)

  if (!fileExist) {
    throw new Error(`[theme-machine] theme folder not found: ${themeName}`)
  }

  return require(themePath)
}
