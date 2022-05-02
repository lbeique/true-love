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
    const session = getSession(req.session)
    if (!session) {
        res.status(404).redirect('/')
        return
    }
    const user_info = session.user_info
    res.status(200).render("mainmenu", { user_info })
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