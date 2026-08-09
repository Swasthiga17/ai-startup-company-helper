const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign(
    { sub: userId },
    process.env.JWT_SECRET || 'supersecretjwtkeyforstartupforge',
    { expiresIn: '30d' }
  );
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = generateToken(user.id);
    return res.status(200).json({ access_token: token, token_type: 'bearer' });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id);
    return res.status(200).json({ access_token: token, token_type: 'bearer' });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res) => {
  return res.status(200).json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
  });
};

const logout = async (req, res) => {
  return res.status(200).json({ status: 'ok' });
};

module.exports = {
  register,
  login,
  me,
  logout,
};
