const User = require('./user.model');

exports.addUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const token = await newUser.generateAuthToken();
    await newUser.save();
    res.status(200).send({ message: 'Success', newUser, token });
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(418)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};

exports.login = async (req, res) => {
  try {
    const token = await req.user.generateAuthToken();
    res.status(200).send({ user: req.user, token });
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(500)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const userList = await User.find({});
    const usernames = userList.map(user => user.username);

    res.status(200).send(usernames);
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(418)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const doc = await User.findOne({ username: req.body.update.username });

    const { newInfo } = req.body;

    if (newInfo.username) doc.username = newInfo.username;
    if (newInfo.email) doc.email = newInfo.email;
    if (newInfo.password) doc.password = newInfo.password;

    await doc.save();

    res.status(200).send({ message: 'Update successful' });
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(418)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.deleteOne(req.body);
    res.status(200).send({ message: 'Deletion successful' });
  } catch (err) {
    console.error('💥 💥', err);
    res
      .status(418)
      .send({ message: 'Something went wrong, check server logs.' });
  }
};
