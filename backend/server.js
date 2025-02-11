require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 4001;

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); 

// Serve static files (CSS, JS, images) from "public" directory
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
app.use(cors());

// Session middleware setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Ensure sessions are only stored when a user logs in
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Import routes
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

// Setup Google Strategy for Passport
const { setupGoogleStrategy } = require("./controller/authen/googleauth");
setupGoogleStrategy();

// Define routes
app.use("/api", apiRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);

// Default route
app.get("/", (req, res) => {
  res.render("index");
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
