const express = require('express')
const router = express.Router();
const bodyParser = require("body-parser")
const database = require("../databaseConnection");
const db = require("../databaseAccess")

router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static("public"))

const getSession = (session) => {
  if (session.username) {
      return session;
  } else {
      return null;
  }
}

router.get("/", (req, res) => {
    res.render('signUpForm')
  })

router.post("/", (req, res) => {
  database.getConnection(function (err, dbConnection) {
    if (err) {
			res.render('error', { message: 'Error connecting to MySQL' });
			console.log("Error connecting to mysql");
			console.log(err);
		} else {
      db.addUser(req.body, (err, result) => {
				if (err) {
					res.render('error', { message: 'Error reading from MySQL' });
					console.log("Error reading from mysql");
					console.log(err);
				}
				else { //success
					res.redirect('/');
          console.log('account created');
				}
      })
      dbConnection.release();
    }
  })
})

module.exports = router;