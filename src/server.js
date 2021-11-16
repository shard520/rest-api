require('./db/connection');
const express = require('express');
const cors = require('cors');
const userRouter = require('./user/user.routes');
const movieRouter = require('./movie/movie.routes');
const app = express();
const port = process.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(movieRouter);

app.get('/health', (req, res) => {
  res.send({ message: "Server's up" });
});

app.listen(port, () => {
  console.log(`Listening on PORT ${port}`);
});
