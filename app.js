require('dotenv').config()

const express = require("express")
const bodyParser = require("body-parser")
const cookieSession = require("cookie-session")

const app = express()


// Routes
const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const triviaRouter = require('./routes/trivia')
const mainMenuRouter = require('./routes/mainmenu')
const lobbyRouter = require('./routes/lobby')
const leaderboardRouter = require('./routes/leaderboard')


// Conflict Oh no
app.set('view engine', 'ejs')
app.use(express.static("./public"))
app.use(bodyParser.urlencoded({ extended: false }))


// :)
app.use(cookieSession({
    name: 'session',
    keys: [process.env.SESSION_USER_KEYS],
}))

// SUPER IMPORTANT TO PUT THESE AT THE END OF APP.USE
app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/trivia', triviaRouter)
app.use('/leaderboard', leaderboardRouter)
app.use('/mainmenu', mainMenuRouter)
app.use('/lobby', lobbyRouter)


module.exports = app
