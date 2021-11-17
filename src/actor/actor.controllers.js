const Actor = require('../actor/actor.model');

exports.addActor = async (req, res) => {
  try {
    const newActor = await Actor.findOrCreate({
      where: { actorName: req.body.name },
    });

    if (!newActor[0]._options.isNewRecord)
      res.status(200).send({ message: 'Actor already exists in the DB.' });
    else res.status(200).send({ message: 'Actor created successfully.' });
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(500)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};

exports.listActors = async (req, res) => {
  try {
    const actors = await Actor.findAll();

    if (actors.length < 1) {
      res.status(500).send({
        message: 'No actors found, please add some actors to the DB.',
      });
      return;
    }

    res.status(200).send(actors);
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(500)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};

exports.findActor = async (req, res) => {
  try {
    const actor = await Actor.findOne({ where: { actorName: req.body.name } });

    if (!actor) {
      res.status(500).send({ message: 'Actor not found.' });
      return;
    }

    res.status(200).send(actor);
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(500)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};

exports.updateActor = async (req, res) => {
  try {
    const updated = await Actor.update(
      { actorName: req.body.newName },
      {
        where: { actorName: req.body.oldName },
      }
    );

    if (!updated[0]) {
      res
        .status(500)
        .send({ message: 'Update unsuccessful, please try again.' });
      return;
    }

    const updatedObj = await Actor.findOne({
      where: { actorName: req.body.newName },
    });

    res.status(200).send({
      message: 'Actor updated successfully.',
      newValues: updatedObj.dataValues,
    });
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(500)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};

exports.deleteActor = async (req, res) => {
  try {
    const deleted = await Actor.destroy({
      where: { actorName: req.body.name },
    });

    if (!deleted) {
      res
        .status(500)
        .send({ message: 'Deletion unsuccessful, please try again.' });
      return;
    }

    res.status(200).send({ message: 'Actor deleted successfully.' });
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(500)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};
