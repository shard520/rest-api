const { DataTypes } = require('sequelize');
const sequelize = require('../MySQL/connection');

const Movie = sequelize.define('Movie', {
  movieTitle: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: {
      max: 10,
    },
  },
  postedBy: {
    type: DataTypes.STRING,
  },
  updatedBy: {
    type: DataTypes.STRING,
  },
});

module.exports = Movie;
