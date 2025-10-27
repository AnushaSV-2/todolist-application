//import modules
const mysql = require('mysql2/promise')
const dotenv = require('dotenv')
//load all the variables create in env file
dotenv.config();

const conn = mysql.createPool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
});

module.exports = conn; // to export to other classes