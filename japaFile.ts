import 'reflect-metadata'
import { join } from 'path'
import getPort from 'get-port'
import { configure } from 'japa'
import sourceMapSupport from 'source-map-support'

import { rollbackMigrations, runMigrations } from './tests/migration.helpers'

process.env.NODE_ENV = 'testing'
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
  files: ['app/**/*.test.ts', 'tests/**/*.test.ts'],
  before: [runMigrations, startHttpServer],
  after: [rollbackMigrations],
  timeout: 10000,
})
