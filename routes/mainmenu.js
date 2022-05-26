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

router.get("/", (req, res) => {
    const session = getSession(req.session)
    if (!session) {
        res.status(404).redirect('/')
        return
    }
    const user_info = session.user_info
    res.status(200).render("mainmenu", { user_info })
    return
})

router.post("/profile", async (req, res) => {
    const session = getSession(req.session)
    if (!session) {
        res.status(404).redirect('/')
        return
    }
    const userId = +req.session.user_info.user_id
    const user_achievements = await database.getUserAchievements(userId)
    console.log('route', user_achievements)
    if (!user_achievements) {
        console.log('Error loading user achievements')
        res.status(404).redirect('/')
        return
    }
    const userData = {
        userInfo: req.session.user_info,
        achievements: user_achievements
    }
    console.log("USER DATA", userData)
    res.json({ userData })
    return
})

router.post("/avatar", async (req, res) => {
    const session = getSession(req.session)
    if (!session) {
        res.status(404).redirect('/')
        return
    }
    const userId = +req.session.user_info.user_id
    const avatarId = +req.body.avatar_id
    const user_avatar = await database.updateUserAvatar(userId, avatarId)
    console.log('avatar route', user_avatar)
    if (!user_avatar) {
        console.log('Error loading user avatar')
        res.status(404).redirect('/')
        return
    }
    req.session.user_info.avatar_name = user_avatar.avatar_name
    res.json({ user_avatar })
    return
})

router.post("/username", async (req, res) => {
    const session = getSession(req.session)
    if (!session) {
        res.status(404).redirect('/')
        return
    }
    const userId = +req.session.user_info.user_id
    const username = req.body.newUsername
    const user_info = await database.updateUsername(userId, username)
    console.log('name route', user_info)
    if (!user_info) {
        console.log('Error loading user info')
        res.status(404).redirect('/')
        return
    }
    req.session.user_info.user_name = user_info.user_name
    req.session.user_info.avatar_name = user_info.avatar_name
    let user_name = user_info.user_name
    res.json({ user_name })
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