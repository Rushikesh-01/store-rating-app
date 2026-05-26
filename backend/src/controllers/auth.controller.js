const authService = require('../services/auth.service');
const { sendSuccess } = require('../utils/response.utils');

const register = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  const result = await authService.registerUser({ name, email, password, address, role });
  return sendSuccess(res, result, 'Registration successful', 201);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });
  return sendSuccess(res, result, 'Login successful');
};

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await authService.updatePassword(req.user.id, { currentPassword, newPassword });
  return sendSuccess(res, result, 'Password updated successfully');
};

const getMe = async (req, res) => sendSuccess(res, { user: req.user }, 'User retrieved');

module.exports = { register, login, updatePassword, getMe };
