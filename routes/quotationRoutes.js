// const express = require('express');
// const router = express.Router();
// const quotationController = require('../controllers/quotationController');
const authMiddleware = require('../middlewares/authMiddleware');

// router.get('/', authMiddleware, quotationController.viewQuotations);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { viewQuotations, downloadPDF } = require('../controllers/quotationController');
// const auth = require('../middleware/auth');

router.get('/', authMiddleware, viewQuotations);
router.get('/pdf/:id', authMiddleware, downloadPDF);

module.exports = router;
