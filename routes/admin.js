const express = require('express'); //Import the express module
const router=express.Router();      //Create a new router object
const checkApiKey =require('../middleware/checkApiKey');    //Import the checkApiKey middleware from the middleware folder
const {showCourses,addCourse,deleteCourse,updateCourse,manageCourses}=require('../controller/admin/adminCourseController'); //Import the showCourses and addCourse functions from the courseController
const {showSubjects,manageSubjects,addSubject,deleteSubject,updateSubject}=require('../controller/admin/adminSubjectController'); //Import the showSubjects function from the subjectController
const {showQuestion,manageQuestion,addQuestion,deleteQuestion,updateQuestion, addBulkJSONQuestions}=require('../controller/admin/adminQuestionController');
const {isAuthenticated}=require('../middleware/isAuthenticated');

router.get('/test', checkApiKey,(req, res) => {
    res.json({ message: 'Hello, world!' });
});

/**
 * @swagger
 * /admin/courses:
 *   get:
 *     summary: Show all courses (admin)
 *     responses:
 *       200:
 *         description: List of courses
 */
router.get('/courses',isAuthenticated,showCourses);

/**
 * @swagger
 * /admin/manageCourse:
 *   get:
 *     summary: Manage courses (admin)
 *     responses:
 *       200:
 *         description: Manage courses page
 */
router.get("/manageCourse",manageCourses);

/**
 * @swagger
 * /admin/addCourse:
 *   post:
 *     summary: Add a new course (admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course added
 */
router.post('/addCourse',addCourse);

/**
 * @swagger
 * /admin/deleteCourse:
 *   delete:
 *     summary: Delete a course (admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Course deleted
 */
router.delete('/deleteCourse',deleteCourse);

/**
 * @swagger
 * /admin/updateCourse:
 *   put:
 *     summary: Update a course (admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: integer
 *               course:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course updated
 */
router.put('/updateCourse',updateCourse);

//Route for the admin to manage the subjects
router.get('/subjects/:course_id',showSubjects);
router.get('/manageSubject/:course_id',manageSubjects);
router.post('/addSubject',addSubject);
router.delete('/deleteSubject',deleteSubject);
router.put('/updateSubject',updateSubject);
//router for the admin to manage the question and option
router.get('/questions/:subject_id',showQuestion);
router.get('/manageQuestion/:subject_id',manageQuestion);
router.post('/addQuestion',addQuestion);
router.post('/addJSONQuestions',addQuestion); // add JSON questions
router.post('/addBulkJSONQuestions',addBulkJSONQuestions); // add bulk JSON questions
router.delete('/deleteQuestion',deleteQuestion);
router.post('/updateQuestion',updateQuestion); // add question ra edit question ma ternary chalako le (public/js/questions.js)
module.exports = router;                       // update ma pani post use gareko