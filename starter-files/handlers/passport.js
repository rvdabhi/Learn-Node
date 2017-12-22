const passport = require('passport');
const mongoose = require('mongoose');
const user = mongoose.model('User');

passport.use(user.createStrategy());

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());