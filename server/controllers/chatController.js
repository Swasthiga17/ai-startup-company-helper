const Chat = require('../models/Chat');
const geminiService = require('../services/geminiService');

const chat = async (req, res, next) => {
  try {
    const { message, idea } = req.body;
    if (!message || !idea) {
      return res.status(400).json({ error: 'Message and idea are required' });
    }

    const reply = await geminiService.answerChat(message, idea);

    await Chat.create({
      userId: req.user.id,
      message,
      response: reply,
    });

    return res.status(200).json(reply); // Plain string response to match Python backend behavior
  } catch (error) {
    next(error);
  }
};

const getChatLogs = async (req, res, next) => {
  try {
    const logs = await Chat.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'ASC']],
    });
    return res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chat,
  getChatLogs,
};
