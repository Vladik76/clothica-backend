import express from 'express';
import { /*authenticate,*/ } from '../middleware/authenticate.js';
import { createOrder } from '../controllers/orderController.js';
import { validateCreateOrder } from '../validations/orderValidation.js';
const router = express.Router();
router.post('/', /*authenticate,*/ validateCreateOrder, createOrder);
export default router;
