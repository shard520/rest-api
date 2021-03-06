const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.MYSQL_URI, {
  // this prevents max connection errors from DB host.
  pool: {
    max: 4,
  },
});

try {
  sequelize.authenticate();
} catch (err) {
  console.error('💥 💥', err);
}

module.exports = sequelize;
