const express = require("express");
const router = express.Router();
const checkApiKey = require("../middleware/checkApiKey");
const authMiddleware = require("../middleware/authMiddleware"); // Import the authentication middleware

const {
  showCourses,
  addCourse,
  deleteCourse,
  updateCourse,
  manageCourses,
} = require("../controller/admin/adminCourseController");

const {
  showSubjects,
  manageSubjects,
  addSubject,
  deleteSubject,
  updateSubject,
} = require("../controller/admin/adminSubjectController");

router.use(authMiddleware); // Protect all admin routes

// Test route
router.get("/test", checkApiKey, (req, res) => {
  res.json({ message: "Hello, world!" });
});

// Admin course management routes
router.get("/courses", showCourses);
router.get("/manageCourse", manageCourses);
router.post("/addCourse", addCourse);
router.delete("/deleteCourse", deleteCourse);
router.put("/updateCourse", updateCourse);

// Admin subject management routes
router.get("/subjects/:course_id", showSubjects);
router.get("/manageSubject/:course_id", manageSubjects);
router.post("/addSubject", addSubject);
router.delete("/deleteSubject", deleteSubject);
router.put("/updateSubject", updateSubject);

module.exports = router;

