const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/add', authMiddleware, productController.addProducts);

module.exports = router;
