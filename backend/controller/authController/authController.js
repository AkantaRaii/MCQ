const passport = require("passport");
const jwt = require("jsonwebtoken");
const db = require("../../database/db");

exports.googleCallback = (req, res) => {
    const user = req.user;
    const token = jwt.sign( // to create jwt token 
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // session time 1hr
    );
    // res.json({ message: "Authentication successful", token });
    res.json({ 
      message: `Authentication successful! Welcome, ${user.username}!`, 
      user: { id: user.id, email: user.email, name: user.username }, 
      token 
    });
  };
  

exports.setupGoogleStrategy = (GoogleStrategy) => {
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

        // if user exit the print 
        db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
          if (err) return done(err); // done is a callback function used by passport.js

          if (results.length > 0) {
            return done(null, results[0]); // If user exists, return the user 
            //null means no error occurred.
          } else {
            const user = { username, email, password_hash: "" };
            db.query("INSERT INTO users SET ?", user, (err, result) => { // if not user exit the create one
              if (err) return done(err); 
              user.id = result.insertId;
              return done(null, user); // If a new user is created, return the user
            });
          }
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id); // Passport stores only the user ID, not the entire user object.
  });

  passport.deserializeUser((id, done) => { // ensures that the full user object is available in req.user
    db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
      if (err) return done(err);
      done(null, results[0]); 
    });
  });
};
