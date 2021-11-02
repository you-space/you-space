import Env from '@ioc:Adonis/Core/Env'

const rules = {
  NODE_ENV: Env.schema.enum.optional(['development', 'production', 'testing'] as const),

  APP_KEY: Env.schema.string.optional(),
  APP_NAME: Env.schema.string(),
  APP_URL: Env.schema.string.optional(),

  SESSION_DRIVER: Env.schema.string.optional(),

  DB_CONNECTION: Env.schema.string.optional(),

  PG_PORT: Env.schema.number.optional(),
  PG_USER: Env.schema.string.optional(),
  PG_PASSWORD: Env.schema.string.optional(),
  PG_DB_NAME: Env.schema.string.optional(),

  TEST_POSTGRES_URL: Env.schema.string.optional(),
  TEST_YOUTUBE_API_KEY: Env.schema.string.optional(),
  TEST_YOUTUBE_CHANNEL_ID: Env.schema.string.optional(),

  CONTENT_PATH: Env.schema.string.optional(),
}

if (process.env.NODE_ENV === 'int-testing') {
  rules.TEST_POSTGRES_URL = Env.schema.string()
  rules.TEST_YOUTUBE_API_KEY = Env.schema.string()
  rules.TEST_YOUTUBE_CHANNEL_ID = Env.schema.string()
}

export default Env.rules(rules)
