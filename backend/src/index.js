require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const app = express();
const router = require("../routes/router");
const { setupGoogleStrategy } = require("../controller/authController");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cors = require("cors");  // Import CORS

app.use(cors());

const port = process.env.PORT || 3000;

app.use(express.json());

// Session middleware setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Setup Passport strategies for authenticationu
setupGoogleStrategy(GoogleStrategy);

// Define Routes
app.use("/api", router);  // Quiz Routee
app.use("/auth",router)

// Default route for testing
app.get("/", (req, res) => {
  res.send("<h1>Welcome to the Quiz App</h1>");
});

app.listen(port, () => {
  console.log(`Quiz API running on port ${port}`);
});
