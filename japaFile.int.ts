import 'reflect-metadata'
import { join } from 'path'
import { configure } from 'japa'
import sourceMapSupport from 'source-map-support'

import { rollbackMigrations, runMigrations } from './tests/migration.helpers'
import { startHttpServer } from './tests/server.helper'

process.env.NODE_ENV = 'int-testing'
process.env.DB_CONNECTION = 'test'
process.env.ADONIS_ACE_CWD = join(__dirname)
sourceMapSupport.install({ handleUncaughtExceptions: false })
/**
 * Configure test runner
 */
configure({
  files: ['./**/*.int.test.ts'],
  before: [runMigrations, startHttpServer],
  after: [rollbackMigrations],
  timeout: 10000,
})
