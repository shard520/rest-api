const { DataTypes } = require('sequelize');
const sequelize = require('../MySQL/connection');

const Genre = sequelize.define('Genre', {
  genreName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  genreID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    unique: true,
  },
});

module.exports = Genre;
