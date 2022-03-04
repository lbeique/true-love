const mysql = require('mysql2');

const is_heroku = process.env.IS_HEROKU || false;

const dbConfigHeroku = {
	host: "uzb4o9e2oe257glt.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
	user: "oxcqcyf863kai5l8",
	password: "nn6nokrej60ld4h3",
	database: "bxh4l3barlfey0sk",
	multipleStatements: false,
	reconnect: true,
	namedPlaceholders: true
};

// We need to come up with a consistent name/password for ALL of our local databases
const dbConfigLocal = {
	host: "localhost",
	user: "developer",
	password: "bearman123",
	database: "true_love_local",
	multipleStatements: false,
	namedPlaceholders: true
};

if (is_heroku) {
	var database = mysql.createPool(dbConfigHeroku);
}
else {
	var database = mysql.createPool(dbConfigLocal);
}

module.exports = database;