const prisma = require('../config/database');

const getStores = async ({ search, sortBy, sortOrder, page, limit, userId }) => {
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const where = search ? {
    OR: [
      { name: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } },
    ],
  } : {};

  const validSortFields = ['name', 'address', 'createdAt'];
  const orderByField = validSortFields.includes(sortBy) ? sortBy : 'name';
  const orderByDirection = sortOrder === 'asc' ? 'asc' : 'desc';

  const [stores, total] = await Promise.all([
    prisma.store.findMany({
      where, skip, take,
      orderBy: { [orderByField]: orderByDirection },
      include: { ratings: { select: { rating: true, userId: true, id: true } } },
    }),
    prisma.store.count({ where }),
  ]);

  const storesWithDetails = stores.map((store) => {
    const avgRating = store.ratings.length > 0
      ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
      : 0;
    const userRating = userId ? store.ratings.find((r) => r.userId === userId) || null : null;
    const { ratings, ...storeData } = store;
    return {
      ...storeData,
      averageRating: parseFloat(avgRating.toFixed(1)),
      totalRatings: store.ratings.length,
      userRating: userRating ? { id: userRating.id, rating: userRating.rating } : null,
    };
  });

  return { stores: storesWithDetails, total };
};

module.exports = { getStores };
