const Investor = require('../models/Investor');

const getInvestors = async (req, res, next) => {
  try {
    let list = await Investor.findAll();
    if (list.length === 0) {
      // Seed fallback values
      list = await Investor.bulkCreate([
        { name: 'Sarah Jenkins', firm: 'Apex Ventures', focus: 'AI & SaaS', minTicket: 100000, maxTicket: 500000, email: 'sarah@apex.vc' },
        { name: 'David Chen', firm: 'Horizon Capital', focus: 'B2B Software', minTicket: 250000, maxTicket: 1000000, email: 'dchen@horizon.cap' },
        { name: 'Elena Rostova', firm: 'Synergy Labs', focus: 'Deeptech & Web3', minTicket: 50000, maxTicket: 200000, email: 'elena@synergy.io' },
      ]);
    }
    return res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

const matchInvestors = async (req, res, next) => {
  try {
    const { idea } = req.body;
    const list = await Investor.findAll();
    // In production, we'd query Gemini or match category vectors. 
    // Here we return mock list.
    return res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInvestors,
  matchInvestors,
};
