import express from 'express';
import { getCategories } from '../controllers/categoryController.js';
import { celebrate } from 'celebrate';

import { getCategoriesSchema } from '../validations/categoryValidation.js';
const router = express.Router();

router.get('/categories', celebrate(getCategoriesSchema), getCategories);

export default router;
