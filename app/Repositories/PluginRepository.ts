import path from 'path'
import execa from 'execa'

import Drive from '@ioc:Adonis/Core/Drive'

import { findConfig, listFolder, isGitUrl } from 'App/Helpers'
import SystemMeta from 'App/Models/SystemMeta'
import Content from 'App/Services/ContentService'

export class PluginRepository {
  public async index() {
    const folders = await listFolder(Content.makePath('plugins'))

    const pluginsActive = await SystemMeta.firstOrCreateMetaArray('plugins:active')

    return await Promise.all(
      folders.map(async (folder) => {
        const config = await findConfig(Content.makePath('plugins', folder))

        return {
          id: folder,
          name: config.name || folder,
          description: config.description || '',
          active: pluginsActive.includes(folder),
        }
      })
    )
  }

  public async show(id: string) {
    const all = await this.index()

    const plugin = all.find((p) => p.id === id)

    return plugin || null
  }

  public async store(gitUrl: string) {
    const name = path.basename(gitUrl).replace('.git', '')
    const filename = Content.makePath('plugins', name)
    const isValid = await isGitUrl(gitUrl)

    if (!isValid) {
      throw new Error('Repository url invalid')
    }

    const exist = await Drive.exists(filename)

    if (exist) {
      throw new Error('plugin already installed')
    }

    await execa('git', ['clone', gitUrl, filename])
  }

  public async update(id: string, active: boolean) {
    const pluginsActive = await SystemMeta.firstOrCreateMetaArray('plugins:active')

    if (active) {
      pluginsActive.push(id)
    }

    if (!active) {
      pluginsActive.splice(pluginsActive.indexOf(id), 1)
    }

    await SystemMeta.updateOrCreateMetaArray('plugins:active', pluginsActive)
  }

  public async destroy(id: string) {
    const filename = Content.makePath('plugins', id)

    await execa('rm', ['-rf', filename])
  }
}

export default new PluginRepository()
