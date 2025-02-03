// const express = require("express");
// const { getALLQuestions } = require("../controller/main");
// const checkApiKey = require("../middleware/checkApiKey");
// const passport = require("passport");
// const { googleCallback } = require("../controller/authController");
// const { signin } = require("../controller/signin");
// const { signup } = require("../controller/signup");

// const router = express.Router();

// // Quiz API Route
// router.get("/questions", checkApiKey, getALLQuestions);

// // Google OAuth Login Route
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// // Google OAuth Callback Route
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/auth/failure",
//   }),
//   googleCallback
// );

// router.get("/auth/failure", (req, res) => {
//   res.status(401).send({ message: "Google Login Failed!" });
// });

// // Sign-up Route
// router.post("/signup", signup);

// // Sign-in Route
// router.post("/signin", signin);

// module.exports = router;

const express = require("express");
const { getALLQuestions } = require("../controller/main");
const checkApiKey = require("../middleware/checkApiKey");
const passport = require("passport");
const { googleCallback } = require("../controller/authController");
const { signin } = require("../controller/signin");
const { signup } = require("../controller/signup");

const router = express.Router();

// Render Sign Up Page
router.get("/signup", (req, res) => {
  res.render("signup");
});

// Render Sign In Page
router.get("/signin", (req, res) => {
  res.render("signin");
});

// Quiz API Route
router.get("/questions", checkApiKey, getALLQuestions);

// Google OAuth Login Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
  }),
  googleCallback
);

router.get("/auth/failure", (req, res) => {
  res.status(401).send({ message: "Google Login Failed!" });
});

// Sign-up Route
router.post("/signup", signup);

// Sign-in Route
router.post("/signin", signin);

module.exports = router;
