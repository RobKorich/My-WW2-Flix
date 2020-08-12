//import express
const express = require('express');
const app = express();
//import morgan for logging
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');

//not correct format like documentation...will fix later
let ww2Movies = [
    {
        title: 'Tora! Tora! Tora!',
        director: 'Richard Fleischer',
        released: '1970'
    },
];

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

//express routing syntax (Express GET route endpoint /movies)
app.get('/movies', (req, res) => {
    res.json(ww2Movies);
});

//GET data about single movie by title
app.get('/movies/:title', (req, res) => {
    res.json(ww2Movies.find((movie) =>
      { return movie.title === req.params.title }));
});

//GET data about movie genre to user
app.get('/movies/genres/:name', (req, res) => {
    res.send('Successful GET request returning data on movie genre');
});

//GET data about movie director to user
app.get('/movies/directors/:name', (req, res) => {
    res.send('Successful GET request returning data on movie director');
});

//POST new user account
app.post('/users', (req, res) => {
    res.send('Successful POST of new user registration');
    /*let newUser = req.body;
  
    if (!newUser.name) {
      const message = 'Missing name in request body';
      res.status(400).send(message);
    } else {
      newUser.id = uuid.v4();
      users.push(newUser);
      res.status(201).send(newUser);
    }*/
  });

//Update user information
app.put('/users/:username', (req, res) => {
    res.send('Successful PUT of new user data');
});

//POST movie to user's favorites list
app.post('/users/:username/favorites/:movieID', (req, res) => {
    res.send('Successful POST of movie to user\'s favorite\'s list');
});

//DELETE movie from user's favorite's list
app.delete('/users/:username/favorites/:movieID', (req, res) => {
    res.send('Successful DELETE of movie from user\'s favorite\'s list');
});

//DELETE user's account
app.delete('/users/:username', (req, res) => {
    res.send('Successful DELETE of user\'s account');
});

//Express GET returns text response at endpoint '/'
app.get('/', (req, res) => {
    res.send('Welcome to My WW2 Flix!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});