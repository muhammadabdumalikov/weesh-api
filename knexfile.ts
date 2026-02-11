import * as dotenv from 'dotenv';
import type { Knex } from 'knex';

dotenv.config();

export const config: Knex.Config = {
  client: 'pg',
  connection:
    process.env.ENV === 'dev'
      ? {
          host: process.env.PGHOST,
          port: +(process.env.PGPORT || 5432),
          database: process.env.PGDATABASE,
          user: process.env.PGUSER,
          password: process.env.PGPASSWORD,
        }
      : process.env.PGSTRING_INTERNAL,
  pool: { min: 2, max: 10 },
  migrations: {
    tableName: '_migrations',
    extension: 'ts',
    disableTransactions: true,
    directory: ['./src/migrations'],
  },
};

export default config;
