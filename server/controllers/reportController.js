const Startup = require('../models/Startup');
const reportService = require('../services/reportService');
const pitchService = require('../services/pitchService');
const path = require('path');
const fs = require('fs');

const downloadPdf = async (req, res, next) => {
  try {
    const { analysisId, idea } = req.query;
    let payload = null;
    let ideaText = idea || 'Startup Idea';

    if (analysisId) {
      const startup = await Startup.findOne({
        where: { id: parseInt(analysisId), userId: req.user.id },
      });
      if (startup) {
        payload = JSON.parse(startup.payload);
        ideaText = startup.idea;
      }
    } else if (idea) {
      const startup = await Startup.findOne({
        where: { idea, userId: req.user.id },
        order: [['createdAt', 'DESC']],
      });
      if (startup) {
        payload = JSON.parse(startup.payload);
      }
    }

    if (!payload) {
      payload = { idea: ideaText };
    }

    const outputDir = path.join(__dirname, '../output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const reportPath = path.join(outputDir, `report_${Date.now()}.pdf`);
    await reportService.generatePdf(payload, reportPath);

    return res.download(reportPath, 'startup_report.pdf');
  } catch (error) {
    next(error);
  }
};

const downloadPptx = async (req, res, next) => {
  try {
    const { analysisId, idea } = req.query;
    let payload = null;
    let ideaText = idea || 'Startup Idea';

    if (analysisId) {
      const startup = await Startup.findOne({
        where: { id: parseInt(analysisId), userId: req.user.id },
      });
      if (startup) {
        payload = JSON.parse(startup.payload);
        ideaText = startup.idea;
      }
    } else if (idea) {
      const startup = await Startup.findOne({
        where: { idea, userId: req.user.id },
        order: [['createdAt', 'DESC']],
      });
      if (startup) {
        payload = JSON.parse(startup.payload);
      }
    }

    if (!payload) {
      payload = { idea: ideaText };
    }

    const outputDir = path.join(__dirname, '../output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const pptxPath = path.join(outputDir, `pitch_${Date.now()}.pptx`);
    await pitchService.generatePptx(payload, pptxPath);

    return res.download(pptxPath, 'pitch_deck.pptx');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  downloadPdf,
  downloadPptx,
};
