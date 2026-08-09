const express = require('express');
const investorController = require('../controllers/investorController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, investorController.getInvestors);
router.post('/match', authMiddleware, investorController.matchInvestors);

module.exports = router;
