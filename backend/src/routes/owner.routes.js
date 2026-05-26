const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/owner.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(authenticate, authorize('STORE_OWNER'));
router.get('/dashboard', ownerController.getDashboard);

module.exports = router;
