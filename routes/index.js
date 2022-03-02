const express = require('express')
const router = express.Router();
const bodyParser = require("body-parser")

router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static("public"))

router.get("/", (req, res) => {
    res.render('welcomeScreen')
  })

module.exports = router;