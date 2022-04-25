require('dotenv').config()
const mysql = require('mysql2')

const dbConfig = {
	host: process.env.DATABASE_HOST || "localhost",
	user: process.env.DATABASE_USER || "developer",
	password: process.env.DATABASE_PASSWORD || "bearman123",
	database: process.env.DATABASE_DATABASE || "true_love_local",
	multipleStatements: false,
	namedPlaceholders: true
}


const database = mysql.createPool(dbConfig).promise()


module.exports = database