const db= require("../../models/db");


exports.getCourse=async(req,res)=>{
    try{
        const [result]=await db.promise().query('SELECT * FROM courses');
        console.log(result);
        return res.status(200).json(result);
    }
    catch(error){
        console.error('Error fetching courses:',error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}
