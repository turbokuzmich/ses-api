import { resolve } from 'path';
import { ConfigModule } from '@nestjs/config';
import { type Options } from '@sequelize/core';
import {
  type ClientConfiguration,
  type UserClientConfigurationParams,
} from '@openfga/sdk';

export type FgaConfig = ClientConfiguration | UserClientConfigurationParams;

export type Config = {
  environment: 'dev' | 'production';
  port: number;
  db: Options;
  fga: FgaConfig;
  users: {
    salt: string;
  };
  auth: {
    secret: string;
  };
};

export default async function loadConfig(): Promise<Config> {
  await ConfigModule.envVariablesLoaded;

  const environment =
    process.env.NODE_ENV === 'production' ? 'production' : 'dev';

  const config: Config = {
    environment,
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    db: {
      dev: {
        logging: true,
        dialect: 'sqlite',
        storage: resolve(process.cwd(), 'db', 'db.sqlite'),
      },
      production: {
        dialect: 'postgres',
        database: process.env.DB_DATABASE,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
        ssl: false,
      },
    }[environment] as Options,
    fga: {
      apiUrl: process.env.FGA_API_URL,
      storeId: process.env.FGA_STORE_ID,
      authorizationModelId: process.env.FGA_AUTHORIZATION_MODEL_ID,
    },
    // redis: {
    //   dev: {
    //     host: 'localhost',
    //     port: 6379,
    //   },
    //   production: {},
    // }[environment],
    users: {
      salt: process.env.SALT ?? 'salt',
    },
    auth: {
      secret: process.env.AUTH_SECRET ?? 'secret',
    },
  };

  return config;
}
