import createError from 'http-errors';
import { Good } from '../models/good.js';

export const getGoods = async (req, res, next) => {
  const {
    page = 1,
    perPage = 10,
    category,
    size,
    minPrice,
    maxPrice,
    gender,
  } = req.query;
  try {
    const pageNum = Math.max(1, parseInt(page ?? '1', 10));
    const perPageNum = Math.min(
      50,
      Math.max(1, parseInt(perPage ?? '10', 10)),
    );
    const skip = (pageNum - 1) * perPageNum;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (Array.isArray(size) && size.length > 0) {
      filter.size = { $in: size };
    }

    if (gender)
      filter.gender = gender;

    if (minPrice || maxPrice) {
      filter['price.value'] = {};
      if (minPrice) filter['price.value'].$gte = Number(minPrice);
      if (maxPrice) filter['price.value'].$lte = Number(maxPrice);
    }

    const [totalGoods, goods] = await Promise.all([
      Good.countDocuments(filter),
      Good.find(filter)
        .skip(skip)
        .limit(perPageNum)
        .lean(),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalGoods / perPageNum));

    res.status(200).json({
      page: pageNum,
      perPage: perPageNum,
      totalGoods,
      totalPages,
      data: goods,
    });
  } catch (err) {
    next(err);
  }
};

export const getGoodById = async (req, res, next) => {
  const { goodId } = req.params;
  const good = await Good.findOne({
    _id: goodId,
  });

  if (!good) {
    next(createHttpError(404, 'Good not found'));
    return;
  }

  res.status(200).json(good);
};
