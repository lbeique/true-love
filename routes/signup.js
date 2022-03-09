const express = require('express')
const router = express.Router();
const bodyParser = require("body-parser")
const database = require("../databaseConnection");
const db = require("../databaseAccess")

router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static("public"))

const getSession = (session) => {
  if (session.user_name) {
    return session;
  } else {
    return null;
  }
}

router.get("/", (req, res) => {
  let user = getSession(req.session)
  if (user) {
    res.status(300).redirect('/lobby')
  } else {
    res.status(200).render('signUpForm')
  }
})

router.post("/", (req, res) => {
  database.getConnection(function (err, dbConnection) {
    if (err) {
      res.status(500).render('error', { message: 'Error connecting to MySQL' });
      console.log("Error connecting to mysql");
      console.log(err);
    } else {
      db.addUser(req.body, (err, result) => {
        if (err) {
          res.status(500).render('error', { message: 'Error reading from MySQL' });
          console.log("Error reading from mysql");
          console.log(err);
        }
        else { //success
          req.session.user_name = req.body.name;
          req.session.user_id = +result.insertId;
          res.status(300).redirect('/');
          console.log('account created');
        }
      })
      dbConnection.release();
    }
  })
})

module.exports = router;