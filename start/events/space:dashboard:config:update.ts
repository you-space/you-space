import SystemMeta from 'App/Models/SystemMeta'
import Space from 'App/Services/Space'
import Application from '@ioc:Adonis/Core/Application'

interface Payload {
  siteName: string
  activePages: string[]
}

const validPages = [
  {
    name: 'space-jobs',
    label: 'Jobs',
    filename: Application.resourcesPath('pages', 'jobs.js'),
  },
  {
    name: 'space-types',
    filename: Application.resourcesPath('pages', 'types.js'),
    label: 'Types',
  },
  {
    name: 'space-items-raw',
    filename: Application.resourcesPath('pages', 'items-raw.js'),
    label: 'Items raw',
  },
]

export default {
  handler: async ({ activePages, siteName }: Payload) => {
    await SystemMeta.updateOrCreate(
      { name: 'space:site:name' },
      { name: 'space:site:name', value: siteName }
    )

    await Promise.all(
      validPages.map(async (page) => {
        if (activePages.includes(page.name)) {
          return await Space.emit('space:pages:create', page)
        }

        await Space.emit('space:pages:delete', page.name)
      })
    )

    await SystemMeta.updateOrCreateMetaArray(
      'space:dashboard:active-pages',
      activePages.filter((name) => validPages.some((vp) => vp.name === name))
    )

    return {
      siteName,
      activePages,
    }
  },
}
