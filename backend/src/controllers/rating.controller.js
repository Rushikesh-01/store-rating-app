const ratingService = require('../services/rating.service');
const { sendSuccess } = require('../utils/response.utils');

const createRating = async (req, res) => {
  const { storeId, rating } = req.body;
  const result = await ratingService.createRating({ userId: req.user.id, storeId, rating });
  return sendSuccess(res, { rating: result }, 'Rating submitted successfully', 201);
};

const updateRating = async (req, res) => {
  const { rating } = req.body;
  const result = await ratingService.updateRating({ ratingId: req.params.id, userId: req.user.id, rating });
  return sendSuccess(res, { rating: result }, 'Rating updated successfully');
};

module.exports = { createRating, updateRating };
