import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { getMe } from '../controllers/userController.js';
const router = express.Router();
router.get('/me', authenticate, getMe);
export default router;
