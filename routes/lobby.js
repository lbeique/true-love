const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser")
const { v4: uuidV4 } = require('uuid')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(express.static("public"))

const getSession = (session) => {
    if (!session.user_info) {
        return null
    }
    return session.user_info
}

router.get("/", (req, res) => {
    let user_info = getSession(req.session)
    if (!user_info) {
        res.status(404).redirect('/')
        return
    }
    res.status(200).render("lobbyList", { user_info })
    return
})

router.post("/createLobby", (req, res) => {
    let user_info = getSession(req.session)
    if (!user_info) {
        res.status(404).redirect('/')
        return
    }
    let roomId = uuidV4()
    res.status(200).redirect(`/lobby/${roomId}`)
    return
})

router.post("/joinLobby", (req, res) => {
    let user_info = getSession(req.session)
    let roomId = res.body.roomId
    if (!user_info) {
        res.status(404).redirect('/')
        return
    }
    res.status(200).redirect(`/${roomId}`)
    return
})

router.get("/:room", (req, res) => {
    let user_info = getSession(req.session)
    let roomId = req.params.room
    if (!user_info) {
        res.status(404).redirect('/')
        return
    }
    res.status(200).render("lobbyRoom", { user_info, roomId })
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