const db= require('../../models/db');

exports.getQuestionsAnswers = async (req, res) => {
    try{
        const subjectId = req.params.subjectId;
        const limit = parseInt(req.params.limit) || 10;

        //selects random questions ids from Questions table with specific subject_id
        const [questionIds] = await db.promise().query('SELECT question_id FROM Questions WHERE subject_id=? ORDER BY RAND() LIMIT ?', [subjectId, limit]);
        const questionIdsArray = questionIds.map(question=>question.question_id);

        //selects questions and options from Questions and Options table with specific question_id
        const [questions] = await db.promise().query(
            'SELECT question_id,question_text FROM Questions WHERE question_id IN (?)', [questionIdsArray]

        );

        //selects options from Options table with specific question_id
        const [answers] = await db.promise().query(
            'SELECT question_id,option_id, option_text, is_correct FROM Options WHERE question_id IN (?)', [questionIdsArray]
        );

        //maps options to questions
        questions.forEach(question=>{
            question.options=answers.filter(answer=>answer.question_id===question.question_id)
        })       
        return res.status(200).json(questions);
    }catch(error){
        return res.status(500).json({message:"Error fetching questions", error:error.message});
    }
}   