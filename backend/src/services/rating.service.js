const prisma = require('../config/database');
const AppError = require('../utils/AppError');

const createRating = async ({ userId, storeId, rating }) => {
  const store = await prisma.store.findUnique({ where: { id: parseInt(storeId) } });
  if (!store) throw new AppError('Store not found.', 404);

  const existing = await prisma.rating.findUnique({
    where: { userId_storeId: { userId, storeId: parseInt(storeId) } },
  });
  if (existing) throw new AppError('You have already rated this store. Please update your rating instead.', 409);

  return prisma.rating.create({
    data: { rating: parseInt(rating), userId, storeId: parseInt(storeId) },
    include: {
      store: { select: { id: true, name: true } },
      user: { select: { id: true, name: true } },
    },
  });
};

const updateRating = async ({ ratingId, userId, rating }) => {
  const existing = await prisma.rating.findUnique({ where: { id: parseInt(ratingId) } });
  if (!existing) throw new AppError('Rating not found.', 404);
  if (existing.userId !== userId) throw new AppError('You can only update your own ratings.', 403);
  if (rating < 1 || rating > 5) throw new AppError('Rating must be between 1 and 5.', 400);

  return prisma.rating.update({
    where: { id: parseInt(ratingId) },
    data: { rating: parseInt(rating) },
    include: {
      store: { select: { id: true, name: true } },
      user: { select: { id: true, name: true } },
    },
  });
};

module.exports = { createRating, updateRating };
