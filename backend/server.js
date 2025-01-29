require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT || 4001;

const apiRoutes = require('./routes/api');
app.use(express.json());
app.use('/api', apiRoutes);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});