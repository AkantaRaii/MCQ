//import the mysql module since we installed mysql2
const mysql= require('mysql2');

// Create a connection to the database
const db=mysql.createConnection({
        host:'localhost',
        port:'3307',
        user:'root',
        password:'',
        database:'Mcq'
    });

db.connect((err)=>{
    if(err){
        console.log(err);
        console.log('Error connecting to the database');
    }
    else{
        console.log('Connected to the database');
    }
})

module.exports=db;
