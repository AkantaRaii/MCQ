require("dotenv").config();
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 4001;

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // 

// Serve static files (CSS, JS, images) from "public" directory
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
