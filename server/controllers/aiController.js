const geminiService = require('../services/geminiService');

const getScore = async (req, res, next) => {
  try {
    const { idea } = req.body;
    if (!idea) {
      return res.status(400).json({ error: 'Idea is required' });
    }
    const score = await geminiService.scoreStartup(idea);
    return res.status(200).json(score);
  } catch (error) {
    next(error);
  }
};

const generateDocument = async (req, res, next) => {
  try {
    const { docType, idea } = req.body;
    if (!docType || !idea) {
      return res.status(400).json({ error: 'docType and idea are required' });
    }

    const content = await geminiService.generateDocument(docType, idea);

    return res.status(200).json({
      status: 'success',
      content,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getScore,
  generateDocument,
};
