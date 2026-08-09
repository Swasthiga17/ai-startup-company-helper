const express = require('express');
const uploadController = require('../controllers/uploadController');
const uploadMiddleware = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, uploadMiddleware.single('file'), uploadController.uploadDocument);

module.exports = router;
