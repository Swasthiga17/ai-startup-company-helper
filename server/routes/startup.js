const express = require('express');
const startupController = require('../controllers/startupController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/analyze', authMiddleware, startupController.analyze);
router.get('/history', authMiddleware, startupController.getHistory);

module.exports = router;
