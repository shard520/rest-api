const Genre = require('../genre/genre.model');

exports.addGenre = async (req, res) => {
  try {
    const newGenre = await Genre.findOrCreate({
      where: { genreName: req.body.genre },
    });

    if (!newGenre[0]._options.isNewRecord)
      res.status(200).send({ message: 'Genre already exists in the DB.' });
    else res.status(200).send({ message: 'Genre created successfully.' });
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(500)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};

exports.listGenres = async (req, res) => {
  try {
    const genres = await Genre.findAll();

    if (genres.length < 1) {
      res.status(500).send({
        message: 'No genres found, please add some genres to the DB.',
      });
      return;
    }

    res.status(200).send(genres);
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(500)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};

exports.findGenre = async (req, res) => {
  try {
    const genre = await Genre.findOne({ where: { genreName: req.body.genre } });

    if (!genre) {
      res.status(500).send({ message: 'Genre not found.' });
      return;
    }

    res.status(200).send(genre);
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(500)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};

exports.updateGenre = async (req, res) => {
  try {
    const updated = await Genre.update(
      { genreName: req.body.newGenre },
      {
        where: { genreName: req.body.oldGenre },
      }
    );

    if (!updated[0]) {
      res
        .status(500)
        .send({ message: 'Update unsuccessful, please try again.' });
      return;
    }

    const updatedObj = await Genre.findOne({
      where: { genreName: req.body.newGenre },
    });

    res.status(200).send({
      message: 'Genre updated successfully.',
      newValues: updatedObj.dataValues,
    });
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(500)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};

exports.deleteGenre = async (req, res) => {
  try {
    const deleted = await Genre.destroy({
      where: { genreName: req.body.genre },
    });

    if (!deleted) {
      res
        .status(500)
        .send({ message: 'Deletion unsuccessful, please try again.' });
      return;
    }

    res.status(200).send({ message: 'Genre deleted successfully.' });
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(500)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};
