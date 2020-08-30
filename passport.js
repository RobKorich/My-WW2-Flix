const passport = require('passport'), //import passport
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'), //Local model.js file
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

//basic HTTP authentication for login requests
passport.use(new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password'
}, (username, password, callback) => {
    console.log(username + '  ' + password);
    Users.findOne({ Username: username }, (error, user) => {
        if (error) {
            console.log(error);
            return callback(error);
        }

        if (!user) {
            console.log('incorrect username');
            return callback(null, false, {message: 'Incorrect username or password.'});
        }

        if (!user.validatePassword(password)) {
            console.log('incorrect password');
            return callback(null, false, {message: 'Incorrect password.'});
        }

        console.log('finished');
        return callback(null, user);
    });
}));

//JWT authentication (JWT is extracted from the header of the HTTP request, "bearer token")
passport.use(new JWTStrategy({
   jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
   secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
    .then((user) => {
        return callback(null, user);
    })
    .catch((error) => {
        return callback(error)
    });
}));