const db=require('../../models/db');

exports.getOptions=async(req,res)=>{
    const questionId=req.params.questionId;
    try{
        const [result]=await db.promise().query('SELECT option_id,option_text,is_correct FROM Options WHERE question_id=?',[questionId]);
        return res.status(200).json(result);
    }catch(error){
        return res.status(500).json({message:"Error fetching options",error:error.message});
    }
}