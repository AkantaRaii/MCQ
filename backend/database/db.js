// const mysql = require("mysql2");
// require("dotenv").config();

// const db = mysql.createConnection({
//     host:process.env.DB_HOST,
//     user:process.env.DB_USER,
//     password:process.env.DB_PASS,
//     database:process.env.DB_NAME,
// });

// db.connect((err)=>{
//     if(err){
//         console.error("Dtabase connetion failed: ", err);
//         return;
//     }

//     console.log("Connected too MYSql database");
// });

// module.exports = db;

const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

module.exports = db;
