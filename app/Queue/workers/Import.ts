import Drive from '@ioc:Adonis/Core/Drive'

import { importIfExist } from 'App/Helpers'
import { Job } from 'App/Queue/Job'
import { ProviderContext } from 'App/Services/ProviderContext'

import ProviderRepository from 'App/Repositories/ProviderRepository'
import Content from 'App/Services/ContentService'

interface Args {
  id: string
}

async function worker(job: Job<Args>) {
  const { id } = job.args

  const provider = await ProviderRepository.show(id)

  if (!provider) {
    throw new Error('Provider not found')
  }

  if (!provider.files.import) {
    throw new Error('Import file not defined')
  }

  const filename = Content.makePath('plugins', provider.plugin.id, provider.files.import)

  const exist = await Drive.exists(filename)

  if (!exist) {
    throw new Error('Import file not found')
  }

  const importer = await importIfExist(filename)

  if (!importer) {
    throw new Error('Import file not found')
  }

  if (typeof importer !== 'function') {
    throw new Error('Importer invalid')
  }

  await provider.loadFieldValues()

  const config = provider.fields.reduce(
    (all, field) => ({
      ...all,
      [field.name]: field.value,
    }),
    {}
  )

  const context = new ProviderContext()

  context.config = config

  await importer(context)

  return Promise.resolve()
}

export default worker
