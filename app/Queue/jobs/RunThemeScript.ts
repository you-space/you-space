import { ProcessCallbackFunction } from 'bull'
import execa from 'execa'

interface Data {
  themeName: string
  scriptName: string
}

export const key = 'theme:scripts'

const timeout = 1000 * 60 * 5

const handler: ProcessCallbackFunction<Data> = async (job, done) => {
  const Theme = (await import('App/Extensions/Theme')).default

  const { themeName, scriptName } = job.data

  const theme = await Theme.findOrFail(themeName)

  const script = theme.scripts?.get(scriptName)

  if (!script) {
    return done(new Error('script not found'))
  }

  const [file, ...args] = script

  const subprocess = execa(file, args, {
    cwd: theme.filename,
  })

  subprocess.stdout?.on('data', (buffer: Buffer) => {
    job.log(buffer.toString('utf-8'))
  })

  setTimeout(() => subprocess.cancel(), timeout)

  await subprocess.then(() => done()).catch((err) => done(err))
}

export default {
  key,
  handler,
}
