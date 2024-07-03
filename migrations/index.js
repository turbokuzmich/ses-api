const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');
const { resolve } = require('path');
const dotenv = require('dotenv');

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

function getDevSequelize() {
  return new Sequelize({
    dialect: 'sqlite',
    storage: resolve(process.cwd(), 'db.sqlite'),
  });
}

function getProductionSequelize() {
  return new Sequelize({
    dialect: 'postgres',
    database: 'ses',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    ssl: false,
  });
}

const sequelize = isProduction ? getProductionSequelize() : getDevSequelize();

const umzug = new Umzug({
  migrations: {
    glob: resolve(process.cwd(), 'migrations', 'files', '*.js'),
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

umzug.up();
