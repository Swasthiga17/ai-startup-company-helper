const express = require('express');
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/score', authMiddleware, aiController.getScore);
router.post('/document/generate', authMiddleware, aiController.generateDocument);

module.exports = router;
