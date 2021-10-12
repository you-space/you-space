import 'reflect-metadata'
import execa from 'execa'
import sourceMapSupport from 'source-map-support'
import getPort from 'get-port'
import { join } from 'path'
import { configure } from 'japa'

process.env.NODE_ENV = 'testing'
process.env.ADONIS_ACE_CWD = join(__dirname)
sourceMapSupport.install({ handleUncaughtExceptions: false })

export async function startHttpServer() {
  const { Ignitor } = await import('@adonisjs/core/build/src/Ignitor')
  process.env.PORT = String(await getPort())
  await new Ignitor(__dirname).httpServer().start()
}

async function runMigrations() {
  await execa.node('ace', ['migration:run'], {
    stdio: 'inherit',
  })
}

async function rollbackMigrations() {
  await execa.node('ace', ['migration:rollback'], {
    stdio: 'inherit',
  })
}

configure({
  files: ['./tests/**/*.test.ts'],
  before: [runMigrations, startHttpServer],
  after: [rollbackMigrations],
  timeout: 10000,
})
