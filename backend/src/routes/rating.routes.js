const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validateRating } = require('../validators/store.validator');
const { body, validationResult } = require('express-validator');

const validateRatingUpdate = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    next();
  },
];

router.post('/', authenticate, authorize('USER'), validateRating, ratingController.createRating);
router.put('/:id', authenticate, authorize('USER'), validateRatingUpdate, ratingController.updateRating);

module.exports = router;
