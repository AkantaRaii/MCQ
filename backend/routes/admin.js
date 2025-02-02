const express = require('express'); //Import the express module
const router=express.Router();      //Create a new router object
const checkApiKey =require('../middleware/checkApiKey');    //Import the checkApiKey middleware from the middleware folder
const {showCourses,addCourse,deleteCourse,updateCourse,manageCourses}=require('../controller/admin/adminCourseController'); //Import the showCourses and addCourse functions from the courseController
router.get('/test', checkApiKey,(req, res) => {
    res.json({ message: 'Hello, world!' });
});

//Add the routes for the admin course management
router.get('/courses',showCourses);
router.get("/manageCourse",manageCourses);
router.post('/addCourse',addCourse);
router.delete('/deleteCourse',deleteCourse);
router.put('/updateCourse',updateCourse);
module.exports = router;