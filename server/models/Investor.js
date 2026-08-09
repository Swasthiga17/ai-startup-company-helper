const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Investor = sequelize.define('Investor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firm: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  focus: {
    type: DataTypes.STRING,
  },
  minTicket: {
    type: DataTypes.INTEGER,
  },
  maxTicket: {
    type: DataTypes.INTEGER,
  },
  email: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'investors',
  timestamps: true,
});

module.exports = Investor;
