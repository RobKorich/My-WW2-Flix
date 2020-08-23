//import express
const express = require('express');
const app = express();
//import morgan for logging
const morgan = require('morgan');
//import bodyParser
const bodyParser = require('body-parser');
//import uuid (not used atm)
const uuid = require('uuid');
//import mongoose
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

//connect mongoose to the database
mongoose.connect('mongodb://localhost:27017/[myWW2FlixDB]', { useNewUrlParser: true, useUnifiedTopology: true });

//invoke morgan logging middleware function
app.use(morgan('common'));
//invoke express static function (routes all requests for static files to their corresponding files within 'public' folder)
app.use(express.static('public'));
//invoke bodyparser function
app.use(bodyParser.json());
//invoke error handling middleware function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Houston we have a problem!');
});

//GET all movies
app.get('/movies', (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

//GET data about single movie by title
app.get('/movies/:title', (req, res) => {
    Movies.findOne({ Title: req.params.title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

//GET data about specific movie genre by name                              
app.get('/movies/genres/:name', (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.name })
      .then((movie) => {
        res.json(
            'Name: ' +
            movie.Genre.Name +
            ' Description: ' +
            movie.Genre.Description
        );
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

//GET data about specific director by name                                
app.get('/movies/directors/:name', (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.name })
      .then((movies) => {
        res.json(
            'Name: ' +
              movies.Director.Name +
              ' Bio: ' +
              movies.Director.Bio +
              ' Birth: ' +
              movies.Director.Birth +
              ' Death: ' +
              movies.Director.Death
          );
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

//POST new user account
app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
});

//GET all users
app.get('/users', (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

//GET user information by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Update user information
app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

//POST movie to user's favorites list array
app.post('/users/:Username/addFavorite/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
       $push: { Favorites: req.params.MovieID }
     },
     { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

//REMOVE movie from user's favorite's list array
app.post('/users/:Username/removeFavorite/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
       $pull: { Favorites: req.params.MovieID }
     },
     { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

//DELETE user's account by username
app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

//Express GET returns text response at endpoint '/'
app.get('/', (req, res) => {
    res.send('Welcome to My WW2 Flix!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});