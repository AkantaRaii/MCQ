const express=require('express');
const router=express.Router();
const {getCourse}=require('../controller/api/apiCoursesController');
const { getSubjects } = require('../controller/api/apiSubjectsController');
const { getQuestionsAnswers } = require('../controller/api/apiQuestionOptionController');

router.get('/courses',getCourse);                                                               //provides all courses                                      
router.get('/course/:courseId/subjects/',getSubjects);                                          //provides every subjects of a course
router.get('/course/subject/:subjectId/questionoption/:limit',getQuestionsAnswers);             //provides question with options 

module.exports=router;