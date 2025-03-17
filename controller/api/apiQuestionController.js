const db = require('../../models/db');

exports.getQuestions = async (req, res) => {
    try{
        const subjectId = req.params.subjectId;
        const limit = parseInt(req.params.limit) || 10;
        console.log("subjectId",subjectId);
        const [result]= await db.promise().query('SELECT question_id,question_text FROM Questions WHERE subject_id=? ORDER BY RAND() LIMIT ?', [subjectId, limit]);
        return res.status(200).json(result);
    }catch(error){
        return res.status(500).json({message:"Error fetching questions", error:error.message});
    }
};