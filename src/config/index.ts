import { resolve } from 'path';
import { ConfigModule } from '@nestjs/config';

export default async () => {
  await ConfigModule.envVariablesLoaded;

  const environment = process.env.NODE_ENV || 'dev';

  return {
    environment,
    port: parseInt(process.env.PORT, 10) || 3000,
    db: {
      dev: {
        logging: true,
        dialect: 'sqlite',
        storage: resolve(process.cwd(), 'db.sqlite'),
      },
      production: {
        dialect: 'postgres',
        database: 'ses',
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        ssl: false,
      },
    }[environment],
    redis: {
      dev: {
        host: 'localhost',
        port: 6379,
      },
      production: {},
    }[environment],
    users: {
      salt: process.env.SALT,
    },
    auth: {
      secret: process.env.AUTH_SECRET,
    },
    session: {
      cookie: process.env.SESSION_COOKIE_NAME,
    },
  };
};
