const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validateCreateUser, validateStore } = require('../validators/store.validator');

router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', adminController.getDashboard);
router.post('/users', validateCreateUser, adminController.createUser);
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/stores', validateStore, adminController.createStore);
router.get('/stores', adminController.getStores);

module.exports = router;
