const express = require('express');
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, chatController.chat);
router.get('/history', authMiddleware, chatController.getChatLogs);

module.exports = router;
