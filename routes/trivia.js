// const express = require('express')
// const router = express.Router()
// const bodyParser = require("body-parser")
// const database = require("../databaseAccess")
// const newTrivia = require("../trivia/trivia") // when we 'play game' from lobby, we want a new trivia question, not the same one



// let trivia // keep the trivia question for this round until player hits play game in lobby. Doesn't work with trivia = newTrivia  

// // !!!!! This needs to change because it breaks if 2 users are logged in at same time.

// // Two possible options: 
// // - track trivia progress in session (quick & easy)
// // - do trivia logic in frontend with ajax calls (harder but better)



// router.use(bodyParser.urlencoded({ extended: false }))
// router.use(express.static("public"))

// const getSession = (session) => {
//     if (!session.user_info) {
//         return null
//     }
//     return session.user_info
// }

// router.get("/", async (req, res) => {
//     let user_info = getSession(req.session)
//     if (!user_info) {
//         res.status(400).redirect('/')
//         return
//     }
//     const newGame = +req.query.newGame
//     if (newGame === 0) {
//         trivia = await newTrivia.random()
//         console.log('trivia route', trivia.answer)
//         res.status(200).render("trivia", { trivia, user_info })
//         return
//     } else {
//         res.status(200).render("trivia", { trivia, user_info })
//         return
//     }
// })

// router.post("/", async (req, res) => {
//     let user_info = getSession(req.session)
//     if (!user_info) {
//         res.status(400).redirect('/')
//         return
//     }
//     const UserAnswer = req.body
//     console.log('trivia post', UserAnswer.prompt)
//     trivia.guess(UserAnswer.prompt)
//     if (trivia.completed) {
//         const points = trivia.point_value
//         await database.updateUserPoints(user_info.user_id, points)
//     }
//     res.status(200).render("triviaResult", { trivia, user_info })
//     return
// })

// router.use((req, res) => {
//     res.status(404).send({ error: "This isn't a valid address." })
//     return
// })

// router.use((err, req, res, next) => {
//     if (res.headersSent) {
//         return (next(err))
//     }
//     console.log('500', err)
//     res.status(500).send({ error: "Something bad happened to the server. :shrug:" })
//     return
// })

// module.exports = router