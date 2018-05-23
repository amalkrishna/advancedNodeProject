const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

// passport.use(
//   new GoogleStrategy(
//     {
//       callbackURL: '/auth/google/callback',
//       clientID: keys.googleClientID,
//       clientSecret: keys.googleClientSecret,
//       proxy: true
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingUser = await User.findOne({ googleId: profile.id });
//         if (existingUser) {
//           return done(null, existingUser);
//         }
//         const user = await new User({
//           googleId: profile.id,
//           displayName: profile.displayName
//         }).save();
//         done(null, user);
//       } catch (err) {
//         done(err, null);
//       }
//     }
//   )
// );

passport.use(
  new GitHubStrategy(
    {
      clientID: keys.githubClientID,
      clientSecret: keys.githubSecret,
      callbackURL: "http://127.0.0.1:5000/auth/github/callback",
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("accessToken: ", accessToken);
      console.log("profile: ", profile.id);

      User.findOne({ githubId: profile.id }).then(existingUser => {
        if (existingUser) {
          //
          done(null, existingUser);
        } else {
          //
          new User({ githubId: profile.id })
            .save()
            .then(user => done(null, user));
        }
      });
    }
  )
);
