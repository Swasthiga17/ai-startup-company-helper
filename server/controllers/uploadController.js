const fs = require('fs');
const path = require('path');

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Save metadata locally/return response matching FastAPI expectations
    return res.status(200).json({
      status: 'success',
      filename: req.file.originalname,
      storage_path: req.file.path,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
};
