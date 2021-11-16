const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

exports.tokenAuth = async (req, res, next) => {
  try {
    const tokenObj = jwt.verify(
      req.header('Authorization').replace('Bearer ', ''),
      process.env.SECRET
    );
    req.user = await User.findOne({ _id: tokenObj._id });
    if (!req.user) throw new Error();
    next();
  } catch (err) {
    console.error('💥 💥', err);
    res.status(500).send({ message: 'Check server error logs.' });
  }
};
