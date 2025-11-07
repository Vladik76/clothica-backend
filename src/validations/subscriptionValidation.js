import { celebrate, Joi, Segments } from 'celebrate';

export const validateSubscribe = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
  })
});
