import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  RABBITMQ_SERVER: string;
}

const envVarsSchema = joi
  .object({
    PORT: joi.number().default(3000),
    DATABASE_URL: joi.string().required(),
    RABBITMQ_SERVER: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,

  RABBITMQ_SERVER: envVars.RABBITMQ_SERVER,
};
