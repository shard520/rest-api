const Actor = require('../actor/actor.model');
const Genre = require('../genre/genre.model');
const Movie = require('../movie/movie.model');
const Rating = require('../rating/rating.model');
const sequelize = require('./connection');

const associations = async () => {
  Movie.belongsToMany(Genre, { through: 'MovieGenres' });
  Genre.belongsToMany(Movie, { through: 'MovieGenres' });

  Movie.belongsToMany(Actor, { through: 'MovieActors' });
  Actor.belongsToMany(Movie, { through: 'MovieActors' });

  Movie.belongsToMany(Rating, { through: 'MovieRatings' });
  Rating.belongsTo(Movie, { foreignKey: 'movieID' });

  await sequelize.sync();
};

associations();
