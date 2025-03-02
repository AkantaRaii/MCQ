const express=require('express');
const router=express.Router();
const checkApiKey=require('../middleware/checkApiKey');
const {getCourse}=require('../controller/api/apiCoursesController');
const { getSubjects } = require('../controller/api/apiSubjectsController');
const { getQuestions } = require('../controller/api/apiQuestionController');
const { getOptions } = require('../controller/api/apiOptionController');
const { route } = require('./admin');

router.get('/courses',getCourse);
router.get('/course/:courseId/subjects/',getSubjects);
router.get('/course/subject/:subjectId/question/:limit',getQuestions);
router.get('/course/subject/question/option/:questionId',getOptions);
module.exports=router;