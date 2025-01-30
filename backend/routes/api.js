const express = require('express'); //Import the express module
const db=require("../models/db");   //Import the db module form the models folder
const router=express.Router();      //Create a new router object
const checkApiKey =require('../middleware/checkApiKey');    //Import the checkApiKey middleware from the middleware folder

router.get('/test', checkApiKey,(req, res) => {
    res.json({ message: 'Hello, world!' });
});
module.exports = router;