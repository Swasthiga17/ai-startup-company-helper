const express = require('express');
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/pdf', authMiddleware, reportController.downloadPdf);
router.get('/pptx', authMiddleware, reportController.downloadPptx);

module.exports = router;
