// Update with your config settings.

const { ConfigService } = require('@nestjs/config');

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config = new ConfigService();
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.HOST,
      user: process.env.DBUSERNAME,
      password: process.env.DBPASSWORD,
      database: process.env.DATABASE,
    },
  },

  staging: {
    client: 'mysql2',
    connection: {
      host: process.env.HOST,
      user: process.env.DBUSERNAME,
      password: process.env.DBPASSWORD,
      database: process.env.DATABASE,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'mysql2',
    connection: {
      host: process.env.HOST,
      user: process.env.DBUSERNAME,
      password: process.env.DBPASSWORD,
      database: process.env.DATABASE,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
