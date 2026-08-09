const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Startup = sequelize.define('Startup', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idea: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  payload: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'analyses',
  timestamps: true,
});

module.exports = Startup;
