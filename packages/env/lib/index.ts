import { config } from '@dotenvx/dotenvx';

export const baseEnv =
  config({
    path: `${import.meta.dirname}/../../../../.env`,
  }).parsed ?? {};

export const dynamicEnvValues = {
  CEB_NODE_ENV: baseEnv.CEB_DEV === 'true' ? 'development' : 'production',
  CEB_APP_KEY: baseEnv.CEB_APP_KEY || '',
} as const;
