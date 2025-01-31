const db = require("../database/db");

const getALLQuestions = (req,res) => {
    db.query("SELECT * FROM questions", (err,results)=>{
        if(err){
            console.error(err);
            return res.status(500).json({error:"Internal server Error"});
        }
        res.json(results);
    });
};

module.exports = {getALLQuestions};
