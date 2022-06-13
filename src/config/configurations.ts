import { resolve } from 'path';
import { EnvTypes } from './types';

export default (): EnvTypes => {
  const environment = process.env.NODE_ENV || 'development';
  return {
    port: parseInt(process.env.PORT || '3000', 10),
    secret: process.env.SECRET || 'secret',
    environment,
    dbUrl: process.env.DATABASE_URL,
    basicUser: process.env.HTTP_BASIC_USER,
    basicPassword: process.env.HTTP_BASIC_PASS,
    redisUrl: process.env.REDIS_URL,
    rootDir: resolve(__dirname, '../../'),
    workDir: resolve(__dirname, '../'),
    uploadDir: resolve(__dirname, '../', 'upload'),
  };
};
