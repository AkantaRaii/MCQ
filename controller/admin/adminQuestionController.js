const db= require("../../models/db");

exports.showQuestion = async (req, res) => {
    try {
        const subject_id = req.params.subject_id;
        const limit = 9; // 9 questions per page
        // 2. Get total question count
        const [[{ count: questionCount }]] = await db.promise().query(
            `SELECT COUNT(*) AS count FROM Questions WHERE subject_id = ?`,
            [subject_id]
        );
        const total_pages = Math.ceil(questionCount / limit);

        const page = Math.max(1, parseInt(req.query.page) || total_pages);

        // 1. Get subject & course info
        const [[subject]] = await db.promise().query(
            `SELECT Subjects.*, Courses.course_name
             FROM Subjects
             JOIN Courses ON Subjects.course_id = Courses.course_id
             WHERE Subjects.subject_id = ?`,
            [subject_id]
        );

        
        if (questionCount === 0) {
            return res.status(200).render('questions', {
                questions: [],
                subject: {
                    ...subject,
                    total_pages: 1,
                    current_page: 1
                }
            });
        }

        const offset = (page - 1) * limit;

        // 3. Get paginated questions
        const [questionRows] = await db.promise().query(
            `SELECT question_id, question_text FROM Questions
             WHERE subject_id = ?
             ORDER BY question_id
             LIMIT ? OFFSET ?`,
            [subject_id, limit, offset]
        );

        const questionIds = questionRows.map(q => q.question_id);
        if (questionIds.length === 0) {
            return res.status(200).render('questions', {
                questions: [],
                subject: {
                    ...subject,
                    total_pages,
                    current_page: page
                }
            });
        }

        // 4. Fetch all options for those questions
        const [optionRows] = await db.promise().query(
            `SELECT question_id, option_text, is_correct FROM Options
             WHERE question_id IN (?)
             ORDER BY question_id`,
            [questionIds]
        );

        // 5. Group options by question
        const questionMap = new Map();
        for (const q of questionRows) {
            questionMap.set(q.question_id, {
                question_id: q.question_id,
                question_text: q.question_text,
                options: []
            });
        }

        for (const opt of optionRows) {
            if (questionMap.has(opt.question_id)) {
                questionMap.get(opt.question_id).options.push([
                    opt.option_text,
                    opt.is_correct
                ]);
            }
        }

        const formattedQuestions = Array.from(questionMap.values());

        // 6. Render response
        res.status(200).render('questions', {
            questions: formattedQuestions,
            subject: {
                ...subject,
                total_pages,
                current_page: page
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching questions",
            error: error.message
        });
    }
};


// { esto format ma hunxa formatted_data respose garda
//   question_id: 1,
//   question_text: "which is the tallest mountain of the world??",
//   options: [
//     ["everest", 1],
//     ["k2", 0],
//     ["makalu", 0],

//     ["macchapuchre", 0]
//   ]
// }
exports.manageQuestion=async(req,res)=>{
    try {
        const subject_id = req.params.subject_id;
        
        // Get subject and course info
        const subjectResult = await db.promise().query(
            'SELECT Subjects.*, Courses.course_name FROM Subjects JOIN Courses ON Subjects.course_id = Courses.course_id WHERE Subjects.subject_id = ?',
            [subject_id]
        );
        const subject = subjectResult[0][0];

        // Get questions and options
        const result = await db.promise().query(
            'SELECT * FROM Questions join Options on Questions.question_id=Options.question_id where Questions.subject_id=?',
            [subject_id]
        );
        const questions = result[0];
        
        // Format the data (keeping your existing logic)
        let formatted_data = [];
        let question_id = [];
        for (let i = 0; i < questions.length; i++) {
            let question = questions[i];
            let obj = {};
            if (!question_id.includes(question.question_id)) {
                question_id.push(question.question_id);
                obj.question_id = question.question_id;
                obj.question_text = question.question_text;
                obj.options = [[question.option_text,question.is_correct]];
                formatted_data.push(obj);
            } else {
                formatted_data.forEach(obj=>{
                    if(obj.question_id==question.question_id){
                        obj.options.push([question.option_text,question.is_correct]);
                    }
                })
            }
        };

        res.status(200).render('questions', {
            questions: formatted_data,
            subject: {
                subject_id: subject.subject_id,
                subject_name: subject.subject_name,
                course_id: subject.course_id,
                course_name: subject.course_name
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching questions",
            error: error.message
        })
    }
}
exports.addQuestion=async(req,res)=>{
    try {
        const{subject_id,question_text,options}=req.body;
        const result=await db.promise().query('insert into Questions(subject_id,question_text) values(?,?)',[subject_id,question_text]);
        const result0=await db.promise().query('select question_id from Questions where question_text=? ORDER BY created_at DESC LIMIT 1',[question_text]);
        const id=result0[0][0].question_id;
        for (let i=0;i<options.length;i++){
            const result=await db.promise().query('INSERT INTO Options(question_id,option_text,is_correct) values(?,?,?)',[id,options[i].option_text,options[i].is_correct]);
        }
        return res.status(200).json({
            message: "Question added successfully",
            question_id: id
        })
    } catch (error) {
        res.status(500).json({
            message: "Error adding question",

            error: error.message
        })
    }
}
exports.deleteQuestion=async(req,res)=>{
    const{questionId}=req.body;
    try {
        const result=await db.promise().query('delete from Questions where question_id=?',[questionId]);
        return res.status(200).json({
            message: "Question deleted successfully",
            questionId: questionId
        })
    } catch (error) {
        res.status(500).json({
            message: "Error deleting question",
            error: error.message
        })
    }
}
exports.updateQuestion=async(req,res)=>{
    try {
        const{question_id,subject_id,question_text,options}=req.body;
        const result=await db.promise().query('update Questions set question_text=? where question_id=?',[question_text,question_id]);
        for (let i=0;i<options.length;i++){
            const result=await db.promise().query('update Options set option_text=?,is_correct=? where question_id=? and option_text=?',[options[i].option_text,options[i].is_correct,question_id,options[i].old_option_text]);
        }
        return res.status(200).json({
            message: "Question updated successfully",
            question_id: question_id
        })
    } catch (error) {
        res.status(500).json({
            message: "Error updating question",
            error: error.message
        })
    }
}

exports.addBulkJSONQuestions = async (req, res) => {
    try {
        const { JSONQuestions, subject_id } = req.body;

        if (!JSONQuestions || !subject_id) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        if (!Array.isArray(JSONQuestions) || JSONQuestions.length === 0) {
            return res.status(400).json({ message: "No valid questions found in the JSON data" });
        }

        for (const question of JSONQuestions) {
            if (!question.question_text || !Array.isArray(question.options)) continue;

            const [result] = await db.promise().query(
                'INSERT INTO Questions (subject_id, question_text) VALUES (?, ?)',
                [subject_id, question.question_text]
            );

            const questionId = result.insertId;
            console.log(`Inserted question with ID: ${questionId}`);
            for (const option of question.options) {
                console.log(`Inserting option for question ID ${questionId}:`, option);
                await db.promise().query(
                    'INSERT INTO Options (question_id, option_text, is_correct) VALUES (?, ?, ?)',
                    [questionId, option.option_text, option.is_correct]
                );
            }
        }

        res.status(200).json({ message: "Bulk questions added successfully" });

    } catch (error) {
        res.status(500).json({
            message: "Error adding bulk questions",
            error: error.message
        });
    }
};
