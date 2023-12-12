const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

// authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async function (email, password, done) {
      // find a user and establish the identity
      let user = await User.findOne({ email: email })
        if (!user) {
          req.flash("error", "Invalid Username");
          return done(null, false);
        }

        // match the password
        if(password !== user.password){
          req.flash("error", "Invalid Password");
          return done(null, false);
        }
        return done(null, user);
    }
  )
);

// serializing the user to decide which key is to be stored in sessions
passport.serializeUser(function (user, done) {
  return done(null, user.id);
});

// deserializing the user from the key it the cookies
passport.deserializeUser(async function (id, done) {
  try{
    let user = await User.findById(id) 
    return done(null, user);
  }catch(err){
    if (err) {
      console.log("Error in finding user ---> Passport");
      return done(err);
    }
  }
});

// check if user authenticated (middleware)
passport.checkAuthentication = function (req, res, next) {
  // if the user is signed in, then pass on the request to the next function(controller's action)
  if (req.isAuthenticated()) {
    return next();
  }

  // if the user is not signed in
  return res.redirect("/");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
    res.locals.user = req.user;
  }

  next();
};

module.exports = passport;
