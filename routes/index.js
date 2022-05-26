const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser")

router.use(bodyParser.urlencoded({ extended: false }))
router.use(express.static("public"))

const getSession = (session) => {
  if (!session.authenticated) {
    return null
  }
  return session
}

router.get("/", (req, res) => {
  console.log("SESSION", req.session)
  let session = getSession(req.session)
  let user_info
  if (!session & !req.session?.user_info?.music_status) {
    req.session.user_info = {}
    req.session.user_info.location = 'welcome'
  } else if (!session) {
    req.session.user_info.location = 'welcome'
  } else {
    req.session.user_info.location = 'welcome'
    user_info = session.user_info
  }
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