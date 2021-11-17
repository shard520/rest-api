const { DataTypes } = require('sequelize');
const sequelize = require('../MySQL/connection');

const Actor = sequelize.define('Actor', {
  actorName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  actorID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    unique: true,
  },
});

module.exports = Actor;
