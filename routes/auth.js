const express = require('express');
const router = express.Router();

const db = require('../models/db');
const {signin}=require('../controller/auth/sigin');


router.get('/signin', (req,res)=>{
    return res.render('sign');
});

router.post('/signin', signin);

module.exports = router;
