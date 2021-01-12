require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const lessMiddleware = require('less-middleware');
const logger = require('morgan');
const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;
const MongoClient = require('mongodb').MongoClient;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const pagesRouter = require('./routes/pages');

passport.use(new Strategy({
    clientID: process.env['FACEBOOK_CLIENT_ID'],
    clientSecret: process.env['FACEBOOK_CLIENT_SECRET'],
    callbackURL: '/facebook',
    profileFields: ['id', 'displayName']
  },
  function(accessToken, refreshToken, profile, cb) {
    profile.token = accessToken;
    return cb(null, profile);
  }));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including logging, parsing, and session handling.
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/pages', pagesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.enable("trust proxy");

//MongoDB connexion
const mongoUri = "mongodb+srv://"+process.env['MONGODB_USER']+":"+process.env['MONGODB_PWD']+"@"+process.env['MONGODB_URI']+"?retryWrites=true&w=majority";
const mongoClient = new MongoClient(mongoUri, { useNewUrlParser: true });
mongoClient.connect()
.catch(error => console.error(`Erreur de connexion à la base de donnée: ${error}`))
.then(function (client) {
    app.locals.db = client.db("open-facebook-data");
});

module.exports = app;