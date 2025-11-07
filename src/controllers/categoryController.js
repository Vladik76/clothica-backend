import { Good } from '../models/good.js';

export const getCategories = async (req, res) => {
  const { page = 1, perPage = 10 } = req.query;
  const skip = (page - 1) * perPage;

  const [agg] = await Good.aggregate([
    { $match: { category: { $ne: null } } },
    { $sort: { createdAt: -1, _id: 1 } },

    {
      $group: {
        _id: '$category',
        image: { $first: '$image' },
        goodsCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    {
      $project: {
        _id: '$_id',
        name: '$category.name',
        image: 1,
        goodsCount: 1,
      },
    },
    { $sort: { name: 1 } },
    {
      $facet: {
        meta: [{ $count: 'total' }],
        data: [{ $skip: skip }, { $limit: perPage }],
      },
    },
  ]).exec();

  const total = agg?.meta?.[0]?.total ?? 0;
  const data = agg?.data ?? [];
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  res.status(200).json({
    page,
    perPage,
    total,
    totalPages,
    data,
  });
};
