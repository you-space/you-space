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

const rules: any = {
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  NODE_ENV: Env.schema.enum(['development', 'production', 'testing'] as const),
  DOMAIN_URL: Env.schema.string(),
  POSTGRES_URL: Env.schema.string(),
}

if (process.env.NODE_ENV === 'testing') {
  rules.TEST_POSTGRES_URL = Env.schema.string()
  rules.TEST_YOUTUBE_API_KEY = Env.schema.string()
  rules.TEST_YOUTUBE_CHANNEL_ID = Env.schema.string()
}

export default Env.rules(rules)
