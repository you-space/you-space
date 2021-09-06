import Env from '@ioc:Adonis/Core/Env'
import { DatabaseConfig } from '@ioc:Adonis/Lucid/Database'

const databaseConfig: DatabaseConfig = {
  connection: Env.get('DB_CONNECTION', 'primary'),

  connections: {
    primary: {
      client: 'pg',
      healthCheck: false,
      connection: {
        host: Env.get('PG_HOST'),
        port: Env.get('PG_PORT'),
        user: Env.get('PG_USER'),
        password: Env.get('PG_PASSWORD', ''),
        database: Env.get('PG_DB_NAME'),
      },
    },

    test: {
      client: 'pg',
      connection: Env.get('TEST_POSTGRES_URL'),
      healthCheck: false,
    },
  },
}

export default databaseConfig
