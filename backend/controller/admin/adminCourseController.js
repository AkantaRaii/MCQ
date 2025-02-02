const { json } = require("express");
const db=require("../../models/db");   //Import the db module form the models folder


exports.showCourses = async (req, res) => {
    try{
        const [courses] = await db.promise().query('SELECT * FROM Courses'); 
        console.log(courses); // Debugging
        
        return res.status(200).render('course', { courses }); 

    }catch(err){
        console.log(err);
        return res.status(500).json({message:'Sql course query error'});
    }
}
exports.manageCourses = async (req, res) => {
    try{
        const [courses] = await db.promise().query('SELECT * FROM Courses'); 
        console.log(courses); // Debugging
        
        return res.status(200).render('manageCourse', { courses }); 

    }catch(err){
        console.log(err);
        return res.status(500).json({message:'Sql course query error'});
    }
}
exports.updateCourse=async(req,res)=>{
    console.log("test");
    const {courseId,course}=req.body;
    if (!courseId || !course){
        return res.status(400).json({message:'client error course id or course name not recieved'});
    }
    try{
        await db.execute('UPDATE Courses SET course_name=? WHERE course_id=?',[course,courseId]);
        return res.status(200).json({message:`${course} updated in courses`});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:'Sql course update error'});
    }
}
exports.addCourse = async (req, res) => {
    const {course}=req.body;
    if (!course){
        return res.status(400).json({message:'client error course name not recieved'});
    }
    try{
        await db.execute('INSERT INTO Courses(course_name) VALUES(?)',[course]);
        const [Course]=await db.promise().query('SELECT * FROM Courses Where course_name=?',[course]);
        return res.status(200).json({course:Course[0]});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:'Sql course insert error'});
    }
}
exports.deleteCourse = async (req, res) => {
    const {courseId}=req.body;
    console.log(courseId);
    if (!courseId){
        return res.status(400).json({message:'client error course id not recieved'});
    }
    try{
        await db.execute('DELETE FROM Courses WHERE course_id=?',[courseId]);
        return res.status(200).json({message:`course with id ${courseId} deleted`});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:'Sql course delete error'});
    }
}