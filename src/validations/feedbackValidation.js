import { Joi, Segments } from 'celebrate';
import { objectIdValidator } from './idValidation.js';

export const getFeedbacksSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).default(3),
    productId: Joi.string().custom(objectIdValidator),
  }),
};

export const createFeedbackSchema = {
  [Segments.BODY]: Joi.object({
    author: Joi.string().min(3).required().messages({
      'string.base': 'Author name must be a string',
      'string.min': 'Author should have at least {#limit} characters',
      'any.required': 'Author is required',
    }),
    description: Joi.string().min(5).required().messages({
      'string.base': 'Description must be a string',
      'string.min': 'Description should have at least {#limit} characters',
      'any.required': 'Description is required',
    }),
    rate: Joi.number().min(1).max(5).required(),
    productId: Joi.string().custom(objectIdValidator),
  }),
};
