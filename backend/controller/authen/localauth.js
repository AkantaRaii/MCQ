const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const db = require("../../models/db");

// Configure Passport Local Strategy
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) return done(err);

      // Ensure we have results
      if (!results || results.length === 0) {
        return done(null, false, { message: "Incorrect email or password." });
      }

      const user = results[0]; // Extract the first result (user object)

      // Compare passwords
      bcrypt.compare(password, user.password_hash, (err, isMatch) => {
        if (err) return done(err);
        if (!isMatch) return done(null, false, { message: "Incorrect email or password." });

        return done(null, user);
      });
    });
  })
);

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
    if (err) return done(err);
    if (!results || results.length === 0) return done(null, false);
    done(null, results[0]);
  });
});

// Local Sign-in Function (Fixed Export)
exports.localSignin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({ message: "Login successful", user });
    });
  })(req, res, next);
};
