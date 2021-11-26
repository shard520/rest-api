require('./MongoDB/connection');
require('./MySQL/connection');
require('./MySQL/associations');
const express = require('express');
const cors = require('cors');
const userRouter = require('./user/user.routes');
const movieRouter = require('./movie/movie.routes');
const actorRouter = require('./actor/actor.routes');
const genreRouter = require('./genre/genre.routes');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(movieRouter);
app.use(actorRouter);
app.use(genreRouter);

app.get('/health', (req, res) => {
  res.send({ message: "Server's up" });
});

app.listen(port, () => {
  console.log(`Listening on PORT ${port}`);
});
