const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const AppError = require('../utils/AppError');

const getDashboardStats = async () => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);
  return { totalUsers, totalStores, totalRatings };
};

const createUser = async ({ name, email, password, address, role }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Email already in use.', 409);

  const hashedPassword = await bcrypt.hash(password, 12);
  return prisma.user.create({
    data: { name, email, password: hashedPassword, address: address || null, role: role || 'USER' },
    select: { id: true, name: true, email: true, address: true, role: true, createdAt: true },
  });
};

const getAllUsers = async ({ search, role, sortBy, sortOrder, page, limit }) => {
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const where = {
    AND: [
      search ? { OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ] } : {},
      role ? { role } : {},
    ],
  };

  const validSortFields = ['name', 'email', 'role', 'createdAt'];
  const orderByField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const orderByDirection = sortOrder === 'asc' ? 'asc' : 'desc';

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where, skip, take,
      orderBy: { [orderByField]: orderByDirection },
      select: { id: true, name: true, email: true, address: true, role: true, createdAt: true, _count: { select: { ratings: true } } },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
};

const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    select: {
      id: true, name: true, email: true, address: true, role: true, createdAt: true,
      ratings: {
        include: { store: { select: { id: true, name: true, address: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  if (!user) throw new AppError('User not found.', 404);
  return user;
};

const createStore = async ({ name, email, address, ownerId }) => {
  const owner = await prisma.user.findUnique({ where: { id: parseInt(ownerId) } });
  if (!owner) throw new AppError('Owner not found.', 404);
  if (owner.role !== 'STORE_OWNER') throw new AppError('User must have STORE_OWNER role.', 400);

  return prisma.store.create({
    data: { name, email, address, ownerId: parseInt(ownerId) },
    include: { owner: { select: { id: true, name: true, email: true } } },
  });
};

const getAllStores = async ({ search, sortBy, sortOrder, page, limit }) => {
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const where = search ? {
    OR: [
      { name: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ],
  } : {};

  const validSortFields = ['name', 'email', 'address', 'createdAt'];
  const orderByField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const orderByDirection = sortOrder === 'asc' ? 'asc' : 'desc';

  const [stores, total] = await Promise.all([
    prisma.store.findMany({
      where, skip, take,
      orderBy: { [orderByField]: orderByDirection },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        ratings: { select: { rating: true } },
        _count: { select: { ratings: true } },
      },
    }),
    prisma.store.count({ where }),
  ]);

  const storesWithAvg = stores.map((store) => {
    const avgRating = store.ratings.length > 0
      ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
      : 0;
    const { ratings, ...storeData } = store;
    return { ...storeData, averageRating: parseFloat(avgRating.toFixed(1)) };
  });

  return { stores: storesWithAvg, total };
};

module.exports = { getDashboardStats, createUser, getAllUsers, getUserById, createStore, getAllStores };
