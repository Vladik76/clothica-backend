import { Feedback } from '../models/feedback.js';
import createHttpError from 'http-errors';

export const getFeedbacks = async (req, res) => {
  const { page = 1, perPage = 3, productId } = req.query;
  const skip = (page - 1) * perPage;
  const feedbacksQuery = Feedback.find({ productId: productId });

  const [totalFeedbacks, feedbacks] = await Promise.all([
    feedbacksQuery.clone().countDocuments(),
    feedbacksQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalFeedbacks / perPage);

  res.status(200).json({
    page,
    perPage,
    totalFeedbacks,
    totalPages,
    feedbacks,
  });
};

export const createFeedback = async (req, res) => {
  const feedback = await Feedback.create({
    ...req.body,
  });
  res.status(201).json(feedback);
};
