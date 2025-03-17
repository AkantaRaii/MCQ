const db=require('../../models/db'); //Import the db object


exports.showSubjects= async (req,res)=>{
    try{
        const courseId = req.params.course_id;
        const result=await db.promise().query('SELECT * FROM Subjects WHERE course_id=?',[courseId]);
        const [result2]=await db.promise().query('SELECT * FROM Courses WHERE course_id=?',[courseId]);
        return res.status(200).render('subjects',{course:result2[0],subjects:result[0]});
    }catch(err){
        return res.status(500).json({message:"error in fetching the subjects"});
    }
}
exports.manageSubjects= async (req,res)=>{
    try{
        const courseId = req.params.course_id;
        const result=await db.promise().query('SELECT * FROM Subjects WHERE course_id=?',[courseId]);
        const [result2]=await db.promise().query('SELECT * FROM Courses WHERE course_id=?',[courseId]);
        return res.status(200).render('manageSubject',{course:result2[0],subjects:result[0]});
    }catch(err){
        return res.status(500).json({message:"error in fetching the subjects"});
    }
}
exports.addSubject= async (req,res)=>{
    try{
        const {course_id,subject_name}=req.body;
        await db.promise().execute('INSERT INTO Subjects(course_id,subject_name) VALUES(?,?)',[course_id,subject_name]);
        const [latestCourse] = await db.promise().query(
            'SELECT * FROM Subjects ORDER BY created_at DESC LIMIT 1'
        );
        return res.status(200).json({subject:latestCourse[0]});
    }catch(err){
        return res.status(500).json({message:"error in adding the subject"});
    }
}
exports.deleteSubject= async (req,res)=>{
    try{
        const {subject_id}=req.body;
        await db.promise().execute('DELETE FROM Subjects WHERE subject_id=?',[subject_id]);
        return res.status(200).json({message:"subject deleted"});
    }catch(err){
        return res.status(500).json({message:"error in deleting the subject"});
    }
}  

exports.updateSubject= async (req,res)=>{
    try{
        const {subject_id,subject_name}=req.body;
        await db.promise().execute('UPDATE Subjects SET subject_name=? WHERE subject_id=?',[subject_name,subject_id]);
        return res.status(200).json({message:"subject updated"});
    }catch(err){
        return res.status(500).json({message:"error in updating the subject"});
    }
}