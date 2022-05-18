const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser")
const database = require("../databaseAccess")

router.use(bodyParser.urlencoded({ extended: false }))
router.use(express.static("public"))

const getSession = (session) => {
  if (!session.authenticated) {
    return null
  }
  return session
}

router.get("/", async (req, res) => {
  const session = getSession(req.session)
  if (!session) {
    res.status(404).redirect('/')
    return
}
  // const all_users = await database.getAllUsers()
  console.log(all_users)
  if (!all_users) {
    console.log('Error loading users for leaderboard')
    res.status(404).redirect('/mainmenu')
    return
  }
  const user_info = session.user_info
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