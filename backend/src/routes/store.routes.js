const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', authenticate, storeController.getStores);

module.exports = router;
