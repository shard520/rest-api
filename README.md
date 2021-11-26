## Movies REST API

# Description

This is a REST API made as part of a full stack app for the CN Master Bootcamp. Users can create an account and add/search/edit/delete movies.

User information uses MongoDB via mongoose, with password hashing from bcryptjs and jsonwebtoken to generate login tokens.

Movie information uses a MySQL DB via sequelize, Movies can have multiple actors and genres associated with them, and ratings are calculated as an average for all the users that have rated that movie.

Users can search by movie title, or find a list of movies starring an actor or in a particular genre, as well as finding movies with a minimum rating.

# Front End

The front end uses React, the repo can be found [here](https://github.com/shard520/movies-react-app) and the site is live at:

https://sh-movies.netlify.app/

# Issues

The MySQL DB is hosted with a free cloud provider and adding a movie with a large list of actors/genres can max out the connection, leading to the movie being added without the complete list of actors/genres.

# To Do

Currently, searching returns all movies that match the query. Adding a feature to limit results to only movies that a user has added would let the app function more like a personal movie library.
