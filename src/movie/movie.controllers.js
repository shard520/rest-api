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
