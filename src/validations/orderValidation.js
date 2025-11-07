import { celebrate } from 'celebrate';
import { withSessionHeader } from './common.js';

export const validateCreateOrder = celebrate({
  ...withSessionHeader,
});
