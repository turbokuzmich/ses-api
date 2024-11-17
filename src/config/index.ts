import { ConfigModule } from '@nestjs/config';
import {
  type ClientConfiguration,
  type UserClientConfigurationParams,
} from '@openfga/sdk';

export type FgaConfig = ClientConfiguration | UserClientConfigurationParams;

export type Config = {
  environment: 'dev' | 'production';
  port: number;
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
