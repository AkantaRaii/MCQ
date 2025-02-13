// const express = require("express");
// const passport = require("passport");
// const { signup } = require("../controller/authen/signup");
// const { localSignin } = require("../controller/authen/localauth");
// const { logout } = require("../controller/authen/logout");

// const router = express.Router();

// // Render Sign Up Page
// router.get("/signup", (req, res) => {
//   res.render("signup");
// });

// // Render Sign In Page
// router.get("/signin", (req, res) => {
//   res.render("signin");
// });

// // Manual Sign-in Route
// router.post("/signin", localSignin);

// // Google OAuth Login Route
// router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// // Google OAuth Callback Route
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/auth/failure" }),
//   (req, res) => {
//     res.redirect("/auth/dashboard"); // Ensure redirect goes to /auth/dashboard
//   }
// );

// // Facebook OAuth Login Route
// router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

// // Facebook OAuth Callback Route
// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", { failureRedirect: "/auth/failure" }),
//   (req, res) => {
//     res.redirect("/auth/dashboard"); // Ensure redirect goes to /auth/dashboard
//   }
// );

// // Authentication Failure Route
// router.get("/failure", (req, res) => {
//   res.status(401).send({ message: "Authentication Failed!" });
// });

// // Logout route
// router.get("/logout", (req, res) => {
//   req.logout((err) => {
//     if (err) return next(err);
//     req.session.destroy(() => {
//       res.redirect("/auth/signin"); // Redirect to login page after logout
//     });
//   });
// });


// // Logout Route
// // router.get("/logout", logout);

// // Sign-up Route
// router.post("/signup", signup);

// // Dashboard Route
// router.get("/dashboard", (req, res) => {
//   if (!req.isAuthenticated()) {
//     return res.redirect("/auth/signin"); // If not authenticated, redirect to sign-in
//   }
//   res.render("dashboard", { user: req.user }); // Render dashboard.ejs and pass user data
// });

// module.exports = router;

const express = require("express");
const passport = require("passport");
const { signup } = require("../controller/authen/signup");
const { localSignin } = require("../controller/authen/localauth");
const { logout } = require("../controller/authen/logout");
const { forgotPassword } = require("../controller/authen/forgotPassword");
const { resetPassword } = require("../controller/authen/resetPassword");

const router = express.Router();

// Render Sign Up Page
router.get("/signup", (req, res) => {
  res.render("signup");
});

// Render Sign In Page
router.get("/signin", (req, res) => {
  res.render("signin");
});

// Manual Sign-in Route
router.post("/signin", localSignin);

// Google OAuth Login Route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    res.redirect("/auth/dashboard");
  }
);

// Facebook OAuth Login Route
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

// Facebook OAuth Callback Route
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    res.redirect("/auth/dashboard");
  }
);

// Authentication Failure Route
router.get("/failure", (req, res) => {
  res.status(401).send({ message: "Authentication Failed!" });
});

// Logout Route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect("/auth/signin");
    });
  });
});

// Sign-up Route
router.post("/signup", signup);

// Forgot Password Routes
router.get("/forgotpassword", (req, res) => {
  res.render("forgotPassword");
});
router.post("/forgot-password", forgotPassword);

// Reset Password Routes
router.get("/reset-password/:token", (req, res) => {
  res.render("resetPassword", { token: req.params.token });
});
router.post("/reset-password/:token", resetPassword);

// Dashboard Route
router.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/signin");
  }
  res.render("dashboard", { user: req.user });
});

module.exports = router;
