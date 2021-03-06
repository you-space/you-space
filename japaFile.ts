import 'reflect-metadata'
import execa from 'execa'
import sourceMapSupport from 'source-map-support'
import { join } from 'path'
import { configure } from 'japa'

process.env.NODE_ENV = 'testing'
process.env.ADONIS_ACE_CWD = join(__dirname)
process.env.CONTENT_PATH = join(__dirname, 'tmp', 'content')

sourceMapSupport.install({ handleUncaughtExceptions: false })

export async function startHttpServer() {
  const { Ignitor } = await import('@adonisjs/core/build/src/Ignitor')
  await new Ignitor(__dirname).httpServer().start()
}

async function runMigrations() {
  console.log('[migrations] running...')

  await execa.node('ace', ['migration:run'])
}

async function runSeeds() {
  console.log('[seeds] running...')

  await execa.node('ace', ['db:seed', '-f', './database/seeders/PermissionSeeder.ts'])
  await execa.node('ace', ['db:seed', '-f', './database/seeders/RoleSeeder.ts'])
}

async function rollbackMigrations() {
  console.log('[migrations] rollback...')

  await execa.node('ace', ['migration:rollback'])
}

configure({
  bail: true,
  files: ['./tests/**/*.test.ts'],
  before: [runMigrations, runSeeds, startHttpServer],
  after: [rollbackMigrations],
})
