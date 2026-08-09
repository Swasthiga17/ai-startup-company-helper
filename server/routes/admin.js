const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/stats', authMiddleware, (req, res) => {
  return res.status(200).json({
    usersCount: 1,
    analysesCount: 1,
    reportsCount: 0,
    status: 'optimal',
  });
});

module.exports = router;
