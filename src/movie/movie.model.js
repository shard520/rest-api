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
    async get() {
      const ratings = await this.getRatings();

      const sum = ratings.reduce(
        (acc, cur) => (acc += cur.dataValues.rating),
        0
      );

      return sum / ratings.length;
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
