const { DataTypes } = require('sequelize');
const Movie = require('../movie/movie.model');
const sequelize = require('../MySQL/connection');

const Rating = sequelize.define('Rating', {
  movieID: {
    type: DataTypes.INTEGER,
    references: { model: Movie, key: 'id' },
    allowNull: false,
    onDelete: 'cascade',
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: {
      max: 10,
    },
    allowNull: false,
  },
  postedBy: {
    type: DataTypes.STRING,
  },
});

module.exports = Rating;
