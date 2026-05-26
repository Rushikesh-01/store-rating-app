const ownerService = require('../services/owner.service');
const { sendSuccess } = require('../utils/response.utils');

const getDashboard = async (req, res) => {
  const data = await ownerService.getOwnerDashboard(req.user.id);
  return sendSuccess(res, data, 'Owner dashboard retrieved');
};

module.exports = { getDashboard };
