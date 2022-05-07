const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser")
const { v4: uuidV4 } = require('uuid')
const handlers = require('../server/handlers')
const { makeCode } = require('../utils/utilities')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(express.static("public"))

const getSession = (session) => {
    if (!session.authenticated) {
        return null
    }
    return session
}

router.get("/", (req, res) => {
    const session = getSession(req.session)
    if (!session) {
        res.status(404).redirect('/')
        return
    }
    const user_info = session.user_info
    res.status(200).render("lobbyList", { user_info })
    return
})

router.post("/createLobby", async (req, res) => {
    const session = getSession(req.session)
    if (!session) {
        res.status(404).redirect('/')
        return
    }
    const roomId = uuidV4()
    const existingRoom = handlers.handleGetLobbyFromId(roomId)
    if (existingRoom) {
        console.log('room already exists')
        res.status(404).redirect('/lobby')
        return
    }
    const roomName = req.body?.room_name
    if (!roomName) {
        console.log('room name is missing')
        res.status(404).redirect('/lobby')
        return
    }
    const roomCode = makeCode(5)
    const room = await handlers.handleCreateLobby(roomId, roomName, roomCode, session.user_info)
    res.status(200).redirect(`/lobby/${room.room_id}`)
    return
})

router.post("/joinLobby", (req, res) => {
    const session = getSession(req.session)
    if (!session) {
        res.status(404).redirect('/')
        return
    }
    console.log(req.body.room_code)
    const room = handlers.handleGetLobbyFromCode(req.body?.room_code)
    console.log('joinLobby room', room)
    if (!room) {
        console.log('room doesnt exists')
        res.status(404).redirect('/lobby')
        return
    }
    res.status(200).redirect(`/lobby/${room.room_id}`)
    return
})

router.get("/:room", (req, res) => {
    const session = getSession(req.session)
    if (!session) {
        res.status(404).redirect('/')
        return
    }
    const room = handlers.handleGetLobbyFromId(req.params['room'])
    if (!room) {
        console.log('room doesnt exists')
        res.status(404).redirect('/')
        return
    }
    const user_info = session.user_info
    res.status(200).render("game", { user_info, room })
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