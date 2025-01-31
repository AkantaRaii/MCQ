const express = require("express");
const {getALLQuestions} = require("../controller/main");
const checkApiKey = require("../middleware/checkApiKey")
const router = express.Router();

router.get("/questions",checkApiKey,getALLQuestions);

module.exports = router;