require("dotenv").config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const cookieParser = require('cookie-parser');
const { isAuthenticated } = require('./middleware/isAuthenticated');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();
const port = process.env.PORT || 4001;

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

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'NMC Prep API Documentation',
    version: '1.0.0',
    description: 'API documentation for the FlutterNode project',
  },
  servers: [
    {
      url: 'http://localhost:' + port,
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/api.js', './routes/admin.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', isAuthenticated, (req,res)=>{
    res.redirect('/admin/courses');
});
app.use('/api',  apiRoutes);
app.use('/auth', authRoutes);
app.use('/admin', isAuthenticated, adminRoutes);

app.listen(port, () => {
    console.log('Server is running on http://localhost:' + port);
});
