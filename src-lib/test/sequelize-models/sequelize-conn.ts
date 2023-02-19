import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
import { getEnvInt, getEnvString } from '../get-env';
config();


export const sequelizeObj = new Sequelize(getEnvString('SEQUELIZE_DB'), getEnvString('SEQUELIZE_USERNAME'), getEnvString('SEQUELIZE_PASSWORD'), {
  host: getEnvString('SEQUELIZE_HOST', '127.0.0.1'),
  port: getEnvInt('SEQUELIZE_PORT', 3306),
  dialect: 'mysql', /* 选择 'mysql' | 'mariadb' | 'postgres' | 'mssql' 其一 */
  dialectOptions: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    supportBigNumbers: true,
    bigNumberStrings: true,
  },
  pool: {
    max: 5,
    min: 0,
    idle: 30000,
  },
  timezone: '+08:00',
  logging: console.log,
});
