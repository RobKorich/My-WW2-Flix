//import express
const express = require('express');
const app = express();
//import morgan for logging
const morgan = require('morgan');

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
//invoke error handling middleware function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Houston we have a problem!');
});

//express routing syntax (Express GET route endpoint /movies)
app.get('/movies', (req, res) => {
    res.json(ww2Movies);
});

//Express GET returns text response at endpoint '/'
app.get('/', (req, res) => {
    res.send('Welcome to My WW2 Flix!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});