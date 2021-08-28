import Application from '@ioc:Adonis/Core/Application'
import Logger from '@ioc:Adonis/Core/Logger'
import fs from 'fs'
import path from 'path'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { promisify } from 'util'
import SystemMeta, { SystemDefaults } from 'App/Models/SystemMeta'
import execa from 'execa'

export default class ThemeController {
  public async index() {
    const currentTheme = await SystemMeta.findBy('name', SystemDefaults.CurrentTheme)
    const themesPath = Application.makePath('content', 'themes')
    const context = await promisify(fs.readdir)(themesPath, { withFileTypes: true })

    return await Promise.all(
      context
        .filter((d) => d.isDirectory())
        .map(async ({ name: themeName }) => {
          const configPath = `${themesPath}/${themeName}/ys-config.json`
          const configFileExist = await promisify(fs.exists)(configPath)

          let config = {
            name: themeName,
            isCurrent: currentTheme ? currentTheme.value === themeName : false,
          }

          if (!configFileExist) {
            return config
          }

          const configFile = require(configPath)

          return {
            ...configFile,
            ...config,
            displayName: configFile.name,
          }
        })
    )
  }

  public async store({ request }: HttpContextContract) {
    const { githubUrl, branch } = await request.validate({
      schema: schema.create({
        githubUrl: schema.string({}, [rules.url()]),
        branch: schema.string.optional(),
      }),
    })

    const repoName = path.basename(githubUrl).replace('.git', '')

    const themesPath = Application.makePath('content', 'themes', repoName)

    const args = ['clone']

    if (branch) {
      args.push('--branch', branch)
    }

    args.push(githubUrl, themesPath)

    await execa('git', args, {
      stdio: 'inherit',
    })
  }

  public async destroy({ params }: HttpContextContract) {
    const name = params.id

    const themesPath = Application.makePath('content', 'themes', name)
    const exists = await promisify(fs.exists)(themesPath)

    if (!exists) {
      throw new Error('theme not found')
    }
    await promisify(fs.rmdir)(themesPath, { recursive: true })
  }

  public async recommendedThemes() {
    return [
      {
        name: 'Revolution theme',
        url: 'https://github.com/you-space/revolution.git',
      },
    ]
  }

  public async setTheme({ request }: HttpContextContract) {
    const { name } = await request.validate({
      schema: schema.create({
        name: schema.string(),
      }),
    })

    const themesPath = Application.makePath('content', 'themes', name)
    const exists = await promisify(fs.exists)(themesPath)

    if (!exists) {
      throw new Error('theme not exist')
    }

    await SystemMeta.updateOrCreate(
      { name: SystemDefaults.CurrentTheme },
      {
        name: SystemDefaults.CurrentTheme,
        value: name,
      }
    )
  }

  public async buildTheme({ request }: HttpContextContract) {
    const { name } = await request.validate({
      schema: schema.create({
        name: schema.string(),
      }),
    })

    const themesPath = Application.makePath('content', 'themes', name)
    const configPath = `${themesPath}/ys-config.json`
    const exists = await promisify(fs.exists)(themesPath)

    if (!exists) {
      throw new Error('theme do not founded')
    }

    const configFileExist = await promisify(fs.exists)(configPath)

    if (!configFileExist) {
      throw new Error('theme do not have build enabled')
    }

    const config = require(configPath)

    Logger.info(`start theme building ${name}`)

    await Promise.all(
      config.build.map(async (command) => {
        Logger.info(`running ${command}`)

        const { stdout } = await execa.commandSync(command, {
          stdio: 'inherit',
          cwd: themesPath,
          execPath: themesPath,
          localDir: themesPath,
          preferLocal: true,
        })

        Logger.info(stdout)
      })
    )
  }
}
