const passport = require("passport");
const { Strategy } = require("passport-google-oauth2");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const { User } = require("../models");

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } =
  process.env;

const googleParams = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_CALLBACK_URL,
  passReqToCallback: true,
};

const googleCallback = async ( req, accessToken, refreshToken, profile, ) => {
  try {
    const { email, displayName } = profile;
    console.log(profile)
    console.log(profile._json)
    const user = await User.findOne({ email });
    if (user) {
      return document(null, user);
    }

    const password = await bcrypt.hash(uuid.v4(), 10);
    
    const newUser = await User.create({email, name: displayName, password, })
    done(null, newUser);
  } catch (err) { 
    done(err);
  }
};

const googleStartegy = new Strategy(googleParams, googleCallback);

passport.use("google", googleStartegy);

module.exports = passport;
