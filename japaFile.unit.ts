import 'reflect-metadata'
import { join } from 'path'
import { configure } from 'japa'
import getPort from 'get-port'
import sourceMapSupport from 'source-map-support'

process.env.NODE_ENV = 'unit-testing'
process.env.DB_CONNECTION = 'test'
process.env.ADONIS_ACE_CWD = join(__dirname)
sourceMapSupport.install({ handleUncaughtExceptions: false })

async function startHttpServer() {
  const { Ignitor } = await import('@adonisjs/core/build/src/Ignitor')
  process.env.PORT = String(await getPort())
  await new Ignitor(__dirname).httpServer().start()
}

/**
 * Configure test runner
 */
configure({
  files: ['./**/*.unit.test.ts'],
  before: [startHttpServer],
})
