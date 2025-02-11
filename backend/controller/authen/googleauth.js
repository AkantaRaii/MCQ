const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const db = require("../../models/db");

exports.googleCallback = (req, res) => {
    const user = req.user;
    const token = jwt.sign( 
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ 
      message: `Authentication successful! Welcome, ${user.username}!`, 
      user: { id: user.id, email: user.email, name: user.username }, 
      token 
    });
  };

exports.setupGoogleStrategy = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        const username = profile.displayName;

        db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
          if (err) return done(err);

          if (results.length > 0) {
            return done(null, results[0]); 
          } else {
            const user = { username, email, password_hash: "" };
            db.query("INSERT INTO users SET ?", user, (err, result) => {
              if (err) return done(err);
              user.id = result.insertId;
              return done(null, user);
            });
          }
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
      if (err) return done(err);
      done(null, results[0]); 
    });
  });
};
