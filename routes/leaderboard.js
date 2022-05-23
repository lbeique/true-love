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

router.post("/global/standings", async (req, res) => {
  const session = getSession(req.session)
  if (!session) {
    res.status(404).redirect('/')
    return
  }
  if (!session.user_info) {
    res.status(404).redirect('/mainmenu')
    return
  }
  const globalLeaderboard = await database.getGlobalLeaderboard()
  if (!globalLeaderboard) {
      console.log('Error loading global leaderboard')
      res.status(404).redirect('/mainmenu')
      return
  }
  const globalLeaderboardData = {
    userInfo: session.user_info,
    globalLeaderboard: globalLeaderboard
  }
  res.json({ globalLeaderboardData })
  return
})

router.post("/global/history", async (req, res) => {
  const session = getSession(req.session)
  if (!session) {
    res.status(404).redirect('/')
    return
  }
  if (!session.user_info) {
    res.status(404).redirect('/mainmenu')
    return
  }
  const globalMatchHistory = await database.getGlobalMatchHistory()
  if (!globalLeaderboard) {
      console.log('Error loading global match history')
      res.status(404).redirect('/mainmenu')
      return
  }
  const globalHistoryData = {
    userInfo: session.user_info,
    globalMatchHistory: globalMatchHistory
  }
  res.json({ globalHistoryData })
  return
})

router.post("/history", async (req, res) => {
  const session = getSession(req.session)
  if (!session) {
    res.status(404).redirect('/')
    return
  }
  if (!session.user_info) {
    res.status(404).redirect('/mainmenu')
    return
  }
  let userId = +session.user_info.userId
  const userMatchHistory = await database.getUserMatchHistory(userId)
  if (!globalLeaderboard) {
      console.log('Error loading user match history')
      res.status(404).redirect('/mainmenu')
      return
  }
  const userHistoryData = {
    userInfo: session.user_info,
    userMatchHistory: userMatchHistory
  }
  res.json({ userHistoryData })
  return
})

router.post("/match", async (req, res) => {
  const session = getSession(req.session)
  if (!session) {
    res.status(404).redirect('/')
    return
  }
  if (!session.user_info) {
    res.status(404).redirect('/mainmenu')
    return
  }
  if (!req.body?.roomId) {
    res.status(404).redirect('/mainmenu')
    return
  }
  let roomId = +req.body.roomId
  const roomUsers = await database.getRoomInformationByRoomId(roomId)
  if (!globalLeaderboard) {
      console.log('Error loading match information')
      res.status(404).redirect('/mainmenu')
      return
  }
  const roomData = {
    userInfo: session.user_info,
    roomUsers: roomUsers
  }
  res.json({ roomData })
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