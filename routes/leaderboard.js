const express = require('express')
const router = express.Router();
const bodyParser = require("body-parser")
const db = require("../databaseAccess")
const database = require("../databaseConnection");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static("public"))

const getSession = (session) => {
  if (session.user_name) {
    return session;
  } else {
    return null;
  }
}

router.get("/", async (req, res) => {
  let user = getSession(req.session)
  database.getConnection(function (err, dbConnection) {
    if (err) {
      res.status(500).render('error', { message: 'Error connecting to MySQL' });
      console.log("Error connecting to mysql");
      console.log(err);
    } else {
      db.getAllUsers((err, result) => {
        if (err) {
          res.status(500).render('error', { message: 'Error reading from MySQL' });
          console.log("Error reading from mysql");
          console.log(err);
        } else { //success
          console.log(result);
          if (result) {
            let allUsers = result;
            res.render('leaderboard', { user, allUsers })
          }
        }
      })
      dbConnection.release();
    }
  })
})

module.exports = router;