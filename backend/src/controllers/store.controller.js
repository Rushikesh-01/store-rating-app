const storeService = require('../services/store.service');
const { sendPaginated } = require('../utils/response.utils');

const getStores = async (req, res) => {
  const { search = '', sortBy = 'name', sortOrder = 'asc', page = 1, limit = 12 } = req.query;
  const userId = req.user ? req.user.id : null;
  const { stores, total } = await storeService.getStores({ search, sortBy, sortOrder, page, limit, userId });
  return sendPaginated(res, stores, total, page, limit, 'Stores retrieved');
};

module.exports = { getStores };
