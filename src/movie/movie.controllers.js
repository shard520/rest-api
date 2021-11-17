const Movie = require('./movie.model');
const Actor = require('../actor/actor.model');
const Genre = require('../genre/genre.model');

exports.addMovie = async (req, res) => {
  try {
    const movieObj = {
      movieTitle: req.body.title,
      postedBy: req.user.username,
      updatedBy: req.user.username,
    };

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
    }

    if (req.body.rating) movieObj.rating = req.body.rating;

    const movie = await Movie.create(movieObj);

    if (actors) {
      actors.forEach(actor => movie.addActor(actor[0]));
    }

    if (genres) {
      genres.forEach(genre => movie.addGenre(genre[0]));
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
      console.log('No movies found, please add some movies to the DB.');
      return;
    }

    const movieList = movies.map(movie => formatResponse(movie));

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
      console.log('Movie not found.');
      return;
    }

    const movie = formatResponse(foundMovie);

    res.status(200).send(movie);
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(500)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};

const formatResponse = movie => {
  let actors = [];
  let genres = [];

  const movieObj = {
    title: movie.movieTitle,
    rating: movie.rating,
    postedBy: movie.postedBy,
    updatedBy: movie.updatedBy,
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
