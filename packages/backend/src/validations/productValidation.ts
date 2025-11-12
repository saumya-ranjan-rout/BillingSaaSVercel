import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().required().max(255),
  code: Joi.string().required().max(100),
  description: Joi.string().allow('', null).optional(),
  price: Joi.number().min(0).required(),
  currency: Joi.string().length(3).default('USD'),
  isActive: Joi.boolean().default(true),
  taxRateIds: Joi.array().items(Joi.string().uuid()).optional()
});

export const updateProductSchema = Joi.object({
  name: Joi.string().max(255).optional(),
  code: Joi.string().max(100).optional(),
  description: Joi.string().allow('', null).optional(),
  price: Joi.number().min(0).optional(),
  currency: Joi.string().length(3).optional(),
  isActive: Joi.boolean().optional(),
  taxRateIds: Joi.array().items(Joi.string().uuid()).optional()
});
