const Movie = require('./movie.model');

exports.addMovie = async (req, res) => {
  try {
    const newMovie = new Movie(req.body);

    await newMovie.save();
    res.status(200).send({ message: 'Success' });
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(418)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};

exports.listMovies = async (req, res) => {
  try {
    const movieList = await Movie.find({});

    res.status(200).send(movieList);
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(418)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const doc = await Movie.findOne({ title: req.body.update.title });

    const { newInfo } = req.body;

    if (newInfo.title) doc.title = newInfo.title;
    if (newInfo.actor) doc.actor = newInfo.actor;
    if (newInfo.genre) doc.genre = newInfo.genre;
    if (newInfo.rating) doc.rating = newInfo.rating;

    await doc.save();

    res.status(200).send({ message: 'Update successful' });
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(418)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    await Movie.deleteOne(req.body);
    res.status(200).send({ message: 'Deletion successful' });
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(418)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};
