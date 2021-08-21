import Env from '@ioc:Adonis/Core/Env'
import { string } from '@ioc:Adonis/Core/Helpers'

if (!process.env.APP_KEY) {
  process.env.APP_KEY = string.generateRandom(32)
}

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production'
}

const rules = {
  NODE_ENV: Env.schema.enum(['development', 'production', 'testing'] as const),

  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  APP_URL: Env.schema.string.optional(),

  DB_CONNECTION: Env.schema.string.optional(),

  PG_PORT: Env.schema.number.optional(),
  PG_USER: Env.schema.string.optional(),
  PG_PASSWORD: Env.schema.string.optional(),
  PG_DB_NAME: Env.schema.string.optional(),

  TEST_POSTGRES_URL: Env.schema.string.optional(),
  TEST_YOUTUBE_API_KEY: Env.schema.string.optional(),
  TEST_YOUTUBE_CHANNEL_ID: Env.schema.string.optional(),
}

if (process.env.NODE_ENV === 'testing') {
  rules.TEST_POSTGRES_URL = Env.schema.string()
  rules.TEST_YOUTUBE_API_KEY = Env.schema.string()
  rules.TEST_YOUTUBE_CHANNEL_ID = Env.schema.string()
}

export default Env.rules(rules)
