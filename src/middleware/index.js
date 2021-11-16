const bcrypt = require('bcryptjs');
const User = require('../user/user.model');

exports.hashPassword = async (req, res, next) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 8);
    next();
  } catch (err) {
    console.error('💥 💥', err);
    res.status(500).send({ message: 'Check server error logs.' });
  }
};

exports.comparePasswords = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (await bcrypt.compare(req.body.password, user.password)) {
      req.user = user;
      next();
    } else {
      throw new Error();
    }
  } catch (err) {
    console.error('💥 💥', err);
    res.status(500).send({ message: 'Check server error logs.' });
  }
};
