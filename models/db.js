//import the mysql module since we installed mysql2
const mysql= require('mysql2');

// Create a connection to the database
const db=mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
    });
 


module.exports=db; //export the connection to be used in other files
