const db= require("../../models/db");

exports.showQuestion= async(req,res)=>{
    try {
        const subject_id = req.params.subject_id;
        const no_of_options = 4;
        const limit = 9;

        // Get subject info first
        const [[subject]] = await db.promise().query(
            'SELECT subjects.*, courses.course_name FROM subjects JOIN courses ON subjects.course_id = courses.course_id WHERE subjects.subject_id = ?',
            [subject_id]
        );

        // Get total count of questions
        const [[{count}]] = await db.promise().query(
            'SELECT COUNT(*) as count FROM questions WHERE subject_id = ?',
            [subject_id]
        );

        // If no questions exist, return early with empty data
        if (count === 0) {
            return res.status(200).render('questions', {
                questions: [],
                subject: {
                    subject_id: subject.subject_id,
                    subject_name: subject.subject_name,
                    course_id: subject.course_id,
                    course_name: subject.course_name,
                    total_pages: 1,
                    current_page: 1
                }
            });
        }

        // Calculate pagination values
        const total_pages = Math.ceil(count/limit);
        const page = parseInt(req.query.page) || total_pages;
        
        // Validate page number
        const validatedPage = Math.max(1, Math.min(page, total_pages));
        const offset = (validatedPage - 1) * limit || 0;
        
        // Get questions and options
        const result = await db.promise().query(
            'SELECT * FROM questions join Options on questions.question_id=Options.question_id where questions.subject_id=? LIMIT ? OFFSET ?',
            [subject_id, limit*no_of_options, offset*no_of_options]
        );
        const questions = result[0];
        
        // Format the data
        let formatted_data = [];
        let question_id = [];
        for (let i = 0; i < questions.length; i++) {
            let question = questions[i];
            let obj = {};
            if (!question_id.includes(question.question_id)) {
                question_id.push(question.question_id);
                obj.question_id = question.question_id;
                obj.question_text = question.question_text;
                obj.options = [[question.option_text, question.is_correct]];
                formatted_data.push(obj);
            } else {
                formatted_data.forEach(obj => {
                    if(obj.question_id == question.question_id) {
                        obj.options.push([question.option_text, question.is_correct]);
                    }
                });
            }
        }

        res.status(200).render('questions', {
            questions: formatted_data,
            subject: {
                subject_id: subject.subject_id,
                subject_name: subject.subject_name,
                course_id: subject.course_id,
                course_name: subject.course_name,
                total_pages: total_pages,
                current_page: validatedPage
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching questions",
            error: error.message
        });
    }
}

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
            'SELECT subjects.*, courses.course_name FROM subjects JOIN courses ON subjects.course_id = courses.course_id WHERE subjects.subject_id = ?',
            [subject_id]
        );
        const subject = subjectResult[0][0];

        // Get questions and options
        const result = await db.promise().query(
            'SELECT * FROM questions join Options on questions.question_id=Options.question_id where questions.subject_id=?',
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
        const result=await db.promise().query('insert into questions(subject_id,question_text) values(?,?)',[subject_id,question_text]);
        const result0=await db.promise().query('select question_id from questions where question_text=? ORDER BY created_at DESC LIMIT 1',[question_text]);
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
        const result=await db.promise().query('delete from questions where question_id=?',[questionId]);
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
        const result=await db.promise().query('update questions set question_text=? where question_id=?',[question_text,question_id]);
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
