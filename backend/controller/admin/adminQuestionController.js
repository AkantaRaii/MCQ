const db= require("../../models/db");

exports.showQuestion= async(req,res)=>{
    try {
    const subject_id=req.params.subject_id;
    const result=await db.promise().query('SELECT * FROM questions join Options on questions.question_id=Options.question_id where questions.subject_id=?',[subject_id]);
    const questions=result[0];
    let formatted_data=[];
    let question_id=[];
    for (let i = 0; i < questions.length; i++) {
        let question = questions[i];
        let obj = {};
        if (!question_id.includes(question.question_id)) {
                question_id.push(question.question_id);
                obj.question_id=question.question_id;
                obj.question_text=question.question_text;
                obj.options=[[question.option_text,question.is_correct]];
                formatted_data.push(obj);
        }else{
            formatted_data.forEach(obj=>{
                if(obj.question_id==question.question_id){
                    obj.options.push([question.option_text,question.is_correct]);
                }
            })
        }


    };
      res.status(200).render('questions',{
        questions:formatted_data
      });
    } catch (error) {
        res.status(500).json({
            message:"Error fetching questions",
            error:error.message
        })
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
