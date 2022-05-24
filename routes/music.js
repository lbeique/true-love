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

router.post("/", (req, res) => {
    let session = getSession(req.session)
    if (!session) {
        req.session.user_info = {}
        req.session.user_info.music_status = {}
        req.session.user_info.music_status.volume = 0.8
        req.session.user_info.music_status.false = false
        req.session.user_info.sfx_status = {}
        req.session.user_info.sfx_status.volume = 0.8
        req.session.user_info.sfx_status.false = false
    }
    let user_info = req.session.user_info
    res.json({ user_info })
    return
})

router.post("/update", (req, res) => {
    let session = getSession(req.session)
    if (!session) {
        req.session.user_info = {}
        req.session.user_info.music_status = {}
        req.session.user_info.sfx_status = {}
    }
    if (req.body?.sound_update) {
        return
    }
    req.session.user_info.music_status = req.body.sound_update.music
    req.session.user_info.sfx_status = req.body.sound_update.sfx
    let user_info = req.session.user_info
    res.json({ user_info })
    return
})






module.exports = router