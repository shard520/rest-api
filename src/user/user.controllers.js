const User = require('./user.model');

exports.addUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(200).send({ message: 'Success' });
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(418)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};
