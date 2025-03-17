const db=require('../../models/db');

exports.getSubjects=async(req,res)=>{
    try{
        const course_id=req.params.courseId;
        const [result]=await db.promise().query('SELECT subject_id,subject_name FROM Subjects WHERE course_id=?',[course_id]);
        return res.status(200).json(result);
    }catch{
        console.error('Error fetching courses:',error);
        return res.status(500).json({error:'Internal Server Error while quering subject'});
    }
};