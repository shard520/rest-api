require('dotenv').config();
const mongoose = require('mongoose');

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connection successful.');
  } catch (err) {
    console.error('💥 💥', err);
  }
};

connection();
