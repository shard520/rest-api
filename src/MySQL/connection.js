const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.MYSQL_URI);

try {
  sequelize.authenticate();
} catch (err) {
  console.error('💥 💥', err);
}

module.exports = sequelize;
