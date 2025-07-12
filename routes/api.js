const express=require('express');
const router=express.Router();
const {getCourse}=require('../controller/api/apiCoursesController');
const { getSubjects } = require('../controller/api/apiSubjectsController');
const { getQuestionsAnswers } = require('../controller/api/apiQuestionOptionController');

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     responses:
 *       200:
 *         description: List of courses
 */
router.get('/courses',getCourse);                                                               //provides all courses                                      

/**
 * @swagger
 * /api/course/{courseId}/subjects/:
 *   get:
 *     summary: Get all subjects for a course
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of subjects
 */
router.get('/course/:courseId/subjects/',getSubjects);                                          //provides every subjects of a course

/**
 * @swagger
 * /api/course/subject/{subjectId}/questionoption/{limit}:
 *   get:
 *     summary: Get questions and options for a subject
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of questions with options
 */
router.get('/course/subject/:subjectId/questionoption/:limit',getQuestionsAnswers);             //provides question with options 

module.exports=router;