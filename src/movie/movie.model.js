const { DataTypes } = require('sequelize');
const { set } = require('../MySQL/connection');
const sequelize = require('../MySQL/connection');

const Movie = sequelize.define('Movie', {
  movieTitle: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  rating: {
    type: DataTypes.VIRTUAL,
    async get() {
      const ratings = await this.getRatings();

      const sum = ratings.reduce(
        (acc, cur) => (acc += cur.dataValues.rating),
        0
      );

      return sum / ratings.length;
    },
    validate: { max: 10 },
  },
  averageRating: {
    type: DataTypes.FLOAT,
  },
  postedBy: {
    type: DataTypes.STRING,
  },
  updatedBy: {
    type: DataTypes.STRING,
  },
});

module.exports = Movie;
