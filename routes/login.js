const express = require('express')
const router = express.Router();
const bodyParser = require("body-parser")
const database = require("../databaseConnection");

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
    res.render('loginForm')
  })

module.exports = router;