//import the mysql module since we installed mysql2
const mysql= require('mysql2');

// Create a connection to the database
const db=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'Mcq'
    });

db.connect((err)=>{
    if(err){
        console.log(err);
    }
    console.log('Connected to the database');
})

module.exports=db;
