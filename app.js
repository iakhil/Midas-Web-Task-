require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));

app.get('/', function(req, res) {
  res.render('index');
});

const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));


var passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.get('/secure', (req, res) => {
  if(userProfile)
  {
    //If user is authenticated, acquire user's profile picture, name and render this.
  res.render('secure', {user: userProfile.displayName, imgurl: userProfile._json.picture});
}
else 
{
  // If the user is not logged in, render this.
  res.render("unauth");
}
if(req.session == null)
{
  res.send("Log in again.")
}
});
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});
app.get('/logout', function(req, res) {
  req.logout();
  req.session.destroy(function(er) {
    if(er)
    {
      console.log(er); 
    }
    req.logout();
  res.redirect('/');
  })
});
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = 'our-google-client-id';
const GOOGLE_CLIENT_SECRET = 'our-google-client-secret';

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://midas-web-task-4.herokuapp.com/auth/google/secure",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));

app.get('/blog', function(req, res) {
  //Render the blog.
  res.render("blog");
})

app.get('/contacts', function(req, res) {
  //Render contacts page.
  res.render("contacts");
});

app.get('/auth/google',

  passport.authenticate('google', { scope : ['profile', 'email'] }));

app.get('/auth/google/secure',
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    //Redirect to secure route if login is successful.
    res.redirect('/secure');
  });














