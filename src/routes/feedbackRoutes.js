import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getFeedbacks,
  createFeedback,
} from '../controllers/feedbackController.js';
import {
  getFeedbacksSchema,
  createFeedbackSchema,
} from '../validations/feedbackValidation.js';

const router = Router();

router.get('/feedbacks', celebrate(getFeedbacksSchema), getFeedbacks);
router.post('/feedbacks', celebrate(createFeedbackSchema), createFeedback);

export default router;
