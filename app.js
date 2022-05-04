require('dotenv').config()

const express = require("express")
const bodyParser = require("body-parser")
const session = require("express-session")
const app = express()

const server = require('http').createServer(app)
const socket = require('socket.io')
const io = socket(server)


const handlers = require('./server/handlers')

// Routes
const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const mainMenuRouter = require('./routes/mainmenu')
const lobbyRouter = require('./routes/lobby')
const leaderboardRouter = require('./routes/leaderboard')


// Session Set-up
const sessionMiddleware = session({
  secret: `${process.env.SESSION_USER_KEYS}`,
  resave: false,
  saveUninitialized: false
})

// Conflict Oh no
app.use(sessionMiddleware)
app.set('socketio', io)
app.set('view engine', 'ejs')
app.use(express.static("./public"))
app.use(bodyParser.urlencoded({ extended: false }))



// socket router stuff
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)

io.use(wrap(sessionMiddleware))


io.use((socket, next) => {
  const session = socket.request.session
  console.log(session)
  if (session && session.authenticated) {
    next()
  } else {
    next(new Error("unauthorized"))
  }
})

// SUPER IMPORTANT TO PUT THESE AT THE END OF APP.USE
app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/leaderboard', leaderboardRouter)
app.use('/mainmenu', mainMenuRouter)
app.use('/lobby', lobbyRouter)



// const handlers = require('./handlers')

io.on('connection', client => {

  console.log(`on-connection, connected with clientid: ${client.id}`)

  // LOBBY USER REFRESH
  client.on('lobby-refresh', () => {
    let lobbies = handlers.handleGetAllLobbies()
    console.log('active-lobbies', lobbies)
    let users = handlers.handleGetAllUsers()
    console.log('users-in-lobbies', users)
    io.to(client.id).emit('lobby-list', lobbies)
  })


  // SERVER JOIN
  client.on('join-room', (roomId, userId, userName) => {

    let user = handlers.handleServerJoin(client, userId, userName)
    console.log('join-room user: ', user)
    if (!user) {
      window.location = '/lobby/'
      return
    }

    let room = handlers.handleGetLobbyFromId(roomId)
    if (!room) {
      window.location = '/lobby/'
      return
    } else if (room.gameState.game_active === true) {
      window.location = '/lobby/'
      return
    }

    let clients = room.clients

    for (const client in clients) {
      if (clients[client].userId === user.userId) {
        // window.location = '/lobby/'
        return
      }
    }


    // CREATE LOBBY
    io.to(client.id).emit('create-lobby', room)
    handlers.handleLobbyJoin(roomId, client)
    console.log('join-room room: ', room)

    client.join(room.room_id)
    io.to(room.room_id).emit('user-joined', user, room)
    console.log(`on-join-room, user ${user.username} connected to room ${room.room_id} with clientid: ${user.socketId}`)


    // SERVER DISCONNECT
    client.on('disconnect', () => {
      handlers.handleLobbyDisconnect(room.room_id, client)
      handlers.handleServerDisconnect(client)
      io.to(room.room_id).emit(`user-disconnected`, user, room)
    })


    // SERVER ERROR
    client.on('error', (err) => {
      console.log('received error from client', client.id)
      console.log(err)
    })


    // GAME TRANSITION
    client.on('game-start', () => {
      console.log('lobby remove')
      io.to(room.room_id).emit('remove-lobby')
      console.log('game start emit')
      io.to(room.room_id).emit('game-start')
    })

    client.on('return-to-lobby', () => {
      console.log('return to lobby')
      io.to(room.room_id).emit('remove-victory')
      console.log('lobby return')
      io.to(room.room_id).emit('create-lobby', room)
    })


    // CRUSHES
    client.on('request_crushes', () => {
      console.log("RUN SERVER")
      io.to(room.room_id).emit('set_crushes-carousel', handlers.handleCrushes(room, user))
    })

    client.on('room_clients', () => {
      io.to(room.room_id).emit('receive room_clients', room)
    })

    // TIMER
    client.on('timer', (counter) => {

      let timer = setInterval(function () {
        io.to(room.room_id).emit('counter', counter)   //  temporary change - should be io.sockets.emit later
        counter--

        if (counter <= 0) {
          io.to(room.room_id).emit('counter-finish', 'game finish')  // temporary change - should be io.sockets.emit  later
          clearInterval(timer)
        }
      }, 1000)
    })


    // TRIVIA
    client.on('trivia_question', (triviasArr) => {
      io.to(client.id).emit('trivia_start', handlers.handleTrivia(client, triviasArr))
    })

    client.on('trivia_check_answer', (data) => {
      io.to(client.id).emit('trivia_reset_state', handlers.checkTriviaAnswer(client, data.correct_answer, data.userAnswer))
    })

    client.on('trivia_next_question', () => {
      io.to(client.id).emit('trivia_start', handlers.nextTrivia(client))
    })


    // VICTORY
    client.on('announce-victory', () => {
      console.log('announcing victory')
      let players = handlers.handleGetLobbyPlayers(room.room_id)
      console.log('players', players)
      io.to(room.room_id).emit('create-victory', handlers.handleGetVictory(players), room)
    })

  })

})

const PORT = process.env.PORT || 8000

server.listen(PORT, () => console.log(`server should be running at http://localhost:${PORT}/`))
