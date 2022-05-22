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
        res.status(404).redirect('/')
        return
    }

    let music = req.session.user_info.music
    let sfx = req.session.user_info.sfx

    res.json({ music, sfx })
    return
})

router.post("/update", (req, res) => {
    let session = getSession(req.session)
    if (!session) {
        res.status(404).redirect('/')
        return
    }
    if (req.body?.session_sounds) {
        return
    }
    req.session.user_info.music = req.body.session_sounds.music
    req.session.user_info.sfx = req.body.session_sounds.sfx

    // req.body.music_update.music
    // let music = req.session.user_info.music
    // let sfx = req.session.user_info.sfx
    // res.json({ music, sfx })
    
    return
})






module.exports = router