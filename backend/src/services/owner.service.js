const prisma = require('../config/database');
const AppError = require('../utils/AppError');

const getOwnerDashboard = async (ownerId) => {
  const store = await prisma.store.findFirst({
    where: { ownerId },
    include: {
      ratings: {
        include: { user: { select: { id: true, name: true, email: true, address: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!store) throw new AppError('No store found for this owner.', 404);

  const averageRating = store.ratings.length > 0
    ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
    : 0;

  return {
    store: { id: store.id, name: store.name, email: store.email, address: store.address },
    averageRating: parseFloat(averageRating.toFixed(1)),
    totalRatings: store.ratings.length,
    ratings: store.ratings.map((r) => ({
      id: r.id, rating: r.rating, createdAt: r.createdAt, user: r.user,
    })),
  };
};

module.exports = { getOwnerDashboard };
