/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env'

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
