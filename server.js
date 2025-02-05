
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const app = express();
const router = require("./backend/routes/auth");
const { setupGoogleStrategy } = require("../controller/authController");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cors = require("cors");
const path = require('path');

app.use(cors());

const port = process.env.PORT || 3000;



// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"../views")); // Define the views directory

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Enable form parsing

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

// Setup Passport strategies for authentication
setupGoogleStrategy(GoogleStrategy);

// Define Routes
app.use("/api", router);
app.use("/auth", router);

// Default route for testing
app.get("/", (req, res) => {
  res.render("index"); // Render the homepage (create index.ejs)
});

app.listen(port, () => {
  console.log(`Quiz API running on port ${port}`);
});
