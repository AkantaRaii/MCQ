require("dotenv").config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const cookieParser = require('cookie-parser');
const { isAuthenticated } = require('./middleware/isAuthenticated');

const app = express();
const port = process.env.PORT || 4001;

const options = {
    key: fs.readFileSync('./ssl/server.key'),
    cert: fs.readFileSync('./ssl/server.cert')
};
// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // 
app.use(cookieParser());
// Serve static files (CSS, JS, images) from "public" directory
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
app.get('/', isAuthenticated, (req,res)=>{
    res.redirect('/admin/courses');
});
app.use('/api',  apiRoutes);
app.use('/auth', authRoutes);
app.use('/admin', isAuthenticated, adminRoutes);

https.createServer(options, app).listen(port, () => {
    console.log('Server is running on https://localhost:' + port);
});
