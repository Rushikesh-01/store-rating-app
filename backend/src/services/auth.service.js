const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { generateToken } = require('../utils/jwt.utils');
const AppError = require('../utils/AppError');

const registerUser = async ({ name, email, password, address, role }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Email already in use.', 409);

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, address: address || null, role: role || 'USER' },
    select: { id: true, name: true, email: true, address: true, role: true, createdAt: true },
  });

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return { user, token };
};

const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError('Invalid email or password.', 401);

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new AppError('Invalid email or password.', 401);

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

const updatePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found.', 404);

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) throw new AppError('Current password is incorrect.', 400);

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });
  return { message: 'Password updated successfully.' };
};

module.exports = { registerUser, loginUser, updatePassword };
