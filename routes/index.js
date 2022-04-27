const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser")

router.use(bodyParser.urlencoded({ extended: false }))
router.use(express.static("public"))

const getSession = (session) => {
  if (!session.user_info) {
    return null
  }
  return session.user_info
}

router.get("/", (req, res) => {
  console.log("SESSION", req.session)
  let user_info = getSession(req.session)
  res.render('welcomeScreen', { user_info })
  return
})

router.use((err, req, res, next) => {
  if (res.headersSent) {
    return (next(err))
  }
  console.log('500', err)
  res.status(500).send({ error: "Something bad happened to the server. :shrug:" })
  return
})

module.exports = router