import * as Joi from 'joi';

export const validationSchemas = {
  appConfig: Joi.object().keys({
    configName: Joi.string().required()
  }).unknown(),
  locateAgent: Joi.object().keys({
        lat: Joi.number().required(),
        lng: Joi.number().required(),
    }).unknown()
}
