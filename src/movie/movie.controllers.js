const Movie = require('./movie.model');
const Actor = require('../actor/actor.model');
const Genre = require('../genre/genre.model');
const Rating = require('../rating/rating.model');
const { Op } = require('sequelize');
const sequelize = require('../MySQL/connection');

exports.addMovie = async (req, res) => {
  try {
    const movieObj = {
      movieTitle: req.body.title,
      postedBy: req.user.username,
      updatedBy: req.user.username,
    };

    const [movie] = await Movie.findOrCreate({
      where: { movieTitle: req.body.title },
      defaults: movieObj,
    });

    let actors, genres;

    if (req.body.actors) {
      actors = await Promise.all(
        req.body.actors.map(actor =>
          Actor.findOrCreate({
            where: {
              actorName: actor,
            },
          })
        )
      );

      actors.forEach(actor => movie.addActor(actor[0]));
    }

    if (req.body.genres) {
      genres = await Promise.all(
        req.body.genres.map(genre =>
          Genre.findOrCreate({
            where: {
              genreName: genre,
            },
          })
        )
      );

      genres.forEach(genre => movie.addGenre(genre[0]));
    }

    if (!movie._options.isNewRecord)
      await movie.update({ updatedBy: req.user.username });

    if (req.body.rating) {
      await addOrUpdateRating(req, movie);
    }

    res.status(200).send({ message: 'Movie created successfully.' });
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(500)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};

exports.listMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll({ include: [Actor, Genre] });

    if (movies.length < 1) {
      res.status(500).send({
        message: 'No movies found, please add some movies to the DB.',
      });
      return;
    }

    const movieList = await Promise.all(
      movies.map(movie => formatResponse(movie))
    );

    res.status(200).send(movieList);
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(500)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};

exports.findMovie = async (req, res) => {
  try {
    const foundMovie = await Movie.findOne({
      where: { movieTitle: req.body.title },
      include: [Actor, Genre],
    });

    if (!foundMovie) {
      res.status(500).send({ message: 'Movie not found.' });
      return;
    }

    const movie = await formatResponse(foundMovie);

    res.status(200).send(movie);
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(500)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};

exports.findByActor = async (req, res) => {
  try {
    const actor = await Actor.findOne({ where: { actorName: req.body.actor } });

    if (!actor) {
      res.status(500).send({ message: 'Actor not found.' });
      return;
    }

    // Get all movies that star actor
    const movies = await Movie.findAll({
      include: [
        {
          model: Actor,
          required: true,
          where: { actorID: actor.dataValues.actorID },
        },
        Genre,
      ],
    });

    // Create a list of all actors that star in each movie found
    const actorList = await Promise.all(movies.map(movie => movie.getActors()));

    // Add the full cast list to the relevant movie
    movies.forEach((movie, i) => (movie.Actors = actorList[i]));

    const movieList = await Promise.all(
      movies.map(movie => formatResponse(movie))
    );

    res.status(200).send(movieList);
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(500)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};

exports.findByGenre = async (req, res) => {
  try {
    const genre = await Genre.findOne({ where: { genreName: req.body.genre } });

    if (!genre) {
      res.status(500).send({ message: 'Genre not found.' });
      return;
    }

    // Get all movies that contain genre
    const movies = await Movie.findAll({
      include: [
        {
          model: Genre,
          required: true,
          where: { genreID: genre.dataValues.genreID },
        },
        Actor,
      ],
    });

    // Create a list of all genres for each movie found
    const genreList = await Promise.all(movies.map(movie => movie.getGenres()));

    // Add the full list of genres to the relevant movie
    movies.forEach((movie, i) => (movie.Genres = genreList[i]));

    const movieList = await Promise.all(
      movies.map(movie => formatResponse(movie))
    );

    res.status(200).send(movieList);
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(500)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};

exports.findByRating = async (req, res) => {
  try {
    const movies = await Movie.findAll({
      where: {
        averageRating: { [Op.gte]: req.body.rating },
      },
      include: [Actor, Genre],
    });
    console.log(movies);

    if (!movies) {
      res.status(500).send({
        message: `No movies found with a rating of ${req.body.rating} or higher.`,
      });
      return;
    }

    const movieList = await Promise.all(
      movies.map(movie => formatResponse(movie))
    );
    res.status(200).send(movieList);
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(500)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const foundMovie = await Movie.findOne({
      where: { movieTitle: req.body.update.title },
      include: [Actor, Genre],
    });

    if (!foundMovie) {
      res.status(500).send({ message: 'Movie not found.' });
      return;
    }

    const { newInfo } = req.body;
    const updates = {};

    if (newInfo.title) updates.movieTitle = newInfo.title;
    if (newInfo.rating) {
      // set new rating on req.body so update functions works correctly
      req.body.rating = newInfo.rating;
      await addOrUpdateRating(req, foundMovie);
    }

    updates.updatedBy = req.user.username;

    foundMovie.set(updates);

    let newActors = [];
    let removeActors = [];
    let newGenres = [];
    let removeGenres = [];

    if (newInfo.addActors) {
      newActors = await Promise.all(
        newInfo.addActors.map(actor =>
          Actor.findOrCreate({
            where: {
              actorName: actor,
            },
          })
        )
      );

      newActors.forEach(actor => foundMovie.addActor(actor[0]));
    }

    if (newInfo.removeActors) {
      removeActors = await Promise.all(
        newInfo.removeActors.map(actor =>
          Actor.findOne({
            where: {
              actorName: actor,
            },
          })
        )
      );

      removeActors.forEach(actor =>
        foundMovie.removeActor(actor.dataValues.actorID)
      );
    }

    if (newInfo.addGenres) {
      newGenres = await Promise.all(
        newInfo.addGenres.map(genre =>
          Genre.findOrCreate({
            where: {
              genreName: genre,
            },
          })
        )
      );

      newGenres.forEach(genre => foundMovie.addGenre(genre[0]));
    }

    if (newInfo.removeGenres) {
      removeGenres = await Promise.all(
        newInfo.removeGenres.map(genre =>
          Genre.findOne({
            where: {
              genreName: genre,
            },
          })
        )
      );

      removeGenres.forEach(genre =>
        foundMovie.removeGenre(genre.dataValues.genreID)
      );
    }

    await foundMovie.save();
    const updatedObj = await Movie.findOne({
      where: { movieTitle: newInfo.title || req.body.update.title },
      include: [Actor, Genre],
    });

    const movieObj = await formatResponse(updatedObj);

    res.status(200).send({ message: 'Update successful: ', movieObj });
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(500)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const deleted = await Movie.destroy({
      where: { movieTitle: req.body.title },
    });

    if (!deleted) {
      res
        .status(500)
        .send({ message: 'Deletion unsuccessful, please try again.' });
      return;
    }

    res.status(200).send({ message: 'Movie deleted successfully.' });
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(500)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};

const formatResponse = async movie => {
  let actors = [];
  let genres = [];

  const movieObj = {
    title: movie.movieTitle,
    rating: movie.rating,
    postedBy: movie.postedBy,
    updatedBy: movie.updatedBy,
    rating: await movie.rating,
  };

  if (movie.Actors) {
    movie.Actors.forEach(actor => actors.push(actor.actorName));
    movieObj.actors = actors;
  }
  if (movie.Genres) {
    movie.Genres.forEach(genre => genres.push(genre.genreName));
    movieObj.genres = genres;
  }

  return movieObj;
};

async function addOrUpdateRating(req, movie) {
  const [rating] = await Rating.findOrCreate({
    where: { postedBy: req.user.username, movieID: movie.dataValues.id },
    defaults: {
      rating: req.body.rating,
      postedBy: req.user.username,
    },
  });

  // This allows user to update their rating
  if (!rating.isNewRecord) {
    await rating.update({ rating: req.body.rating });
  }

  movie.addRating(rating);

  const [[avgRating]] = await sequelize.query(
    `SELECT AVG(rating) AS avg FROM Ratings WHERE movieID=${movie.dataValues.id};`
  );

  await movie.update({ averageRating: avgRating.avg });
}
