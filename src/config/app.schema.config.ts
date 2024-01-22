import * as Joi from 'joi';

export default Joi.object({
  /* APP */
  PORT: Joi.number().required(),
  DEFAULT_LIMIT: Joi.number().positive().required(),
  MAXIMUM_LIMIT: Joi.number().positive().required(),
  ACCESS_TOKEN_SECRET: Joi.required(),
  ACCESS_TOKEN_EXPIRATION: Joi.required(),
  REFRESH_TOKEN_SECRET: Joi.required(),
  REFRESH_TOKEN_EXPIRATION: Joi.required(),
  MAXIMUM_IMAGE_FILE_SIZE_IN_MB: Joi.number().integer().min(1).required(),

  /* DATABASE */
  DATABASE_HOST: Joi.required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USER: Joi.required(),
  DATABASE_PASSWORD: Joi.required(),
  DATABASE_NAME: Joi.required(),
  DATABASE_LOG: Joi.required(),

  /* CLOUDINARY */
  CLOUDINARY_CLOUD_NAME: Joi.required(),
  CLOUDINARY_API_KEY: Joi.required(),
  CLOUDINARY_API_SECRET: Joi.required(),
});
