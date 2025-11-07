import createError from 'http-errors';
import User from '../models/user.js';

export async function getMe(req, res, next) {
  try {
    if (!req.user?.userId) throw createError(401, 'Unauthorized');
    const user = await User.findById(req.user.userId).select('-passwordHash').lean();
    if (!user) throw createError(404, 'User not found');
    res.json({ data: user });
  } catch (e) { next(e); }
}
