const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'chats',
  timestamps: true,
});

module.exports = Chat;
