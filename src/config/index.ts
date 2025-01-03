import { join } from 'path';
import { BullRootModuleOptions } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import {
  type ClientConfiguration,
  type UserClientConfigurationParams,
} from '@openfga/sdk';

export type FgaConfig = ClientConfiguration | UserClientConfigurationParams;

export type Environment = 'dev' | 'production';

export type Config = {
  environment: Environment;
  port: number;
  uploadPath: string;
  fga: FgaConfig;
  redis: BullRootModuleOptions;
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
    uploadPath: process.env.UPLOAD_PATH ?? join(process.cwd(), 'uploads'),
    fga: {
      apiUrl: process.env.FGA_API_URL,
      storeId: process.env.FGA_STORE_ID,
      authorizationModelId: process.env.FGA_AUTHORIZATION_MODEL_ID,
    },
    redis: {
      dev: {
        redis: {
          host: 'localhost',
          port: 6379,
        },
      },
      production: {
        redis: {
          host: 'redis',
          port: 6379,
        },
      },
    }[environment],
    users: {
      salt: process.env.SALT ?? 'salt',
    },
    auth: {
      secret: process.env.AUTH_SECRET ?? 'secret',
    },
  };

  return config;
}
