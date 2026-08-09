const Startup = require('../models/Startup');
const geminiService = require('../services/geminiService');
const ragService = require('../services/ragService');

const analyze = async (req, res, next) => {
  try {
    const { idea } = req.body;
    if (!idea) {
      return res.status(400).json({ error: 'Idea is required' });
    }

    const context = await ragService.getContext(idea);

    // Fetch analysis blocks from Gemini agents in parallel
    const [market, competitors, swot, business_model, mvp, revenue, score, pitch] = await Promise.all([
      geminiService.analyzeMarket(idea, context),
      geminiService.analyzeCompetitors(idea),
      geminiService.analyzeSwot(idea),
      geminiService.analyzeBusinessModel(idea),
      geminiService.analyzeMvp(idea),
      geminiService.analyzeRevenue(idea),
      geminiService.scoreStartup(idea),
      geminiService.generatePitchDeck(idea),
    ]);

    const result = {
      idea,
      market,
      competitors,
      swot,
      business_model,
      mvp,
      revenue,
      score,
      pitch,
    };

    const startup = await Startup.create({
      userId: req.user.id,
      idea,
      payload: JSON.stringify(result),
    });

    return res.status(200).json({
      status: 'success',
      data: result,
      analysisId: startup.id,
    });
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const history = await Startup.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({ status: 'success', data: history });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyze,
  getHistory,
};
