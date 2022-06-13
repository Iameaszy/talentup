export enum Environment {
  development = 'development',
  production = 'production',
}

export type EnvTypes = {
  port: number;
  secret: string;
  environment: string;
  rootDir: string;
  workDir: string;
  uploadDir: string;
  dbUrl: string;
  basicUser: string;
  basicPassword: string;
  redisUrl: string;
};
