const express = require('express');
const router=express.Router();

const checkApiKey =require('../middleware/checkApiKey');

router.get('/test', checkApiKey,(req, res) => {
    res.json({ message: 'Hello, world!' });
});
module.exports = router;