const adminService = require('../services/admin.service');
const { sendSuccess, sendPaginated } = require('../utils/response.utils');

const getDashboard = async (req, res) => {
  const stats = await adminService.getDashboardStats();
  return sendSuccess(res, stats, 'Dashboard statistics retrieved');
};

const createUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  const user = await adminService.createUser({ name, email, password, address, role });
  return sendSuccess(res, { user }, 'User created successfully', 201);
};

const getUsers = async (req, res) => {
  const { search = '', role, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = req.query;
  const { users, total } = await adminService.getAllUsers({ search, role, sortBy, sortOrder, page, limit });
  return sendPaginated(res, users, total, page, limit, 'Users retrieved');
};

const getUserById = async (req, res) => {
  const user = await adminService.getUserById(req.params.id);
  return sendSuccess(res, { user }, 'User retrieved');
};

const createStore = async (req, res) => {
  const { name, email, address, ownerId } = req.body;
  const store = await adminService.createStore({ name, email, address, ownerId });
  return sendSuccess(res, { store }, 'Store created successfully', 201);
};

const getStores = async (req, res) => {
  const { search = '', sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = req.query;
  const { stores, total } = await adminService.getAllStores({ search, sortBy, sortOrder, page, limit });
  return sendPaginated(res, stores, total, page, limit, 'Stores retrieved');
};

module.exports = { getDashboard, createUser, getUsers, getUserById, createStore, getStores };
