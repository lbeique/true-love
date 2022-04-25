const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser")
const database = require("../databaseAccess")

router.use(bodyParser.urlencoded({ extended: false }))
router.use(express.static("public"))

const getSession = (session) => {
  if (!session.user_info) {
    return null
  }
  return session.user_info
}

router.get("/", async (req, res) => {
  const user_info = getSession(req.session)
  const all_users = await database.getAllUsers()
  console.log(all_users)
  if (!all_users) {
    console.log('Error loading users for leaderboard')
    res.status(404).redirect('/lobby')
    return
  }
  res.render('leaderboard', { user_info, all_users })
  return
})

router.use((req, res) => {
  res.status(404).send({ error: "This isn't a valid address." })
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