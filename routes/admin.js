const express = require('express'); //Import the express module
const router=express.Router();      //Create a new router object
const checkApiKey =require('../middleware/checkApiKey');    //Import the checkApiKey middleware from the middleware folder
const {showCourses,addCourse,deleteCourse,updateCourse,manageCourses}=require('../controller/admin/adminCourseController'); //Import the showCourses and addCourse functions from the courseController
const {showSubjects,manageSubjects,addSubject,deleteSubject,updateSubject}=require('../controller/admin/adminSubjectController'); //Import the showSubjects function from the subjectController
const {showQuestion,manageQuestion,addQuestion,deleteQuestion,updateQuestion}=require('../controller/admin/adminQuestionController');
const {isAuthenticated}=require('../middleware/isAuthenticated');
router.get('/test', checkApiKey,(req, res) => {
    res.json({ message: 'Hello, world!' });
});

//Add the routes for the admin course management
router.get('/courses',isAuthenticated,showCourses);
router.get("/manageCourse",manageCourses);
router.post('/addCourse',addCourse);
router.delete('/deleteCourse',deleteCourse);
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
router.delete('/deleteQuestion',deleteQuestion);
router.post('/updateQuestion',updateQuestion); // add question ra edit question ma ternary chalako le (public/js/questions.js)
module.exports = router;                       // update ma pani post use gareko