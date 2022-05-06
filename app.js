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
    console.log('handle-get-all-lobbies', lobbies)
    let users = handlers.handleGetAllUsers()
    console.log('handle-get-all-users', users)
    io.to(client.id).emit('lobby-list', lobbies)
  })


  // SERVER JOIN
  client.on('join-room', (roomId, userId, userName) => {

    let user = handlers.handleServerJoin(client, userId, userName)
    console.log('join-room user: ', user)
    if (!user) {
      // window.location = '/lobby/'
      return
    }

    let room = handlers.handleGetLobbyFromId(roomId)
    if (!room) {
      // window.location = '/lobby/'
      return
    } else if (room.gameState.game_active === true) {
      // window.location = '/lobby/'
      return
    }

    let clients = room.clients

    for (const client in clients) {
      if (clients[client].userId === user.userId) {
        // window.location = '/lobby/' // ! DON'T FORGET TO MENTION THIS AGAIN
        return
      }
    }


    // CREATE LOBBY
    io.to(client.id).emit('create-lobby', room)
    console.log(`${client.id} emit create-lobby -> handle lobby-join`, room)
    handlers.handleLobbyJoin(roomId, client)
    console.log(`${client.id} handle-lobby-join -> client.join-room`, room)
    client.join(room.room_id)
    console.log(`${client.id} client.join-room -> emit user-joined`, room)
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


    // VOTING TRANSITION
    client.on('voting-start', () => {
      console.log('emit voting-start -> emit remove-lobby')
      io.to(room.room_id).emit('remove-lobby')
      console.log('gameState update, number of players fixed update')
      handlers.handleGameState(room)
      console.log('crush start emit')
      io.to(room.room_id).emit('crush-start', handlers.handleCrushes(room, user))
    })

    // RETURN TO LOBBY TRANSITION
    client.on('return-to-lobby', () => {
      console.log(`${client.id} emit return-to-lobby -> emit remove-victory`)
      io.to(client.id).emit('remove-victory')
      console.log(`${client.id} emit remove-victory -> emit create-lobby`)
      io.to(client.id).emit('create-lobby', room)
    })


    // CRUSHES
    client.on('room_clients', () => {
      io.to(client.id).emit('receive room_clients', room)
    })


    // CRUSHES TRANSITION
    client.on('voted_crush', (data) => {
      const checkVotingState = handlers.handleVote(data.votedCrush, user, room)
      if (typeof checkVotingState === "string") {
        io.to(room.room_id).emit('client_voted', checkVotingState)
      } else {
        io.to(room.room_id).emit('client_voted', checkVotingState.clientId)
        io.to(room.room_id).emit('crush_voting_result', checkVotingState.topVotedCrush)
        setTimeout(() => {
          console.log('settimeout timer1')
          gameTimer('start-crush-timer', 'remove-crush', 'trivia', 5)

        }, 11000);
      }
    })


    // SKATEBOARD HELPER FUNCTIONS
    function gameTimer(startEmit, cleanEmit, nextPhase, counter) {
      let timer = setInterval(function () {
        io.to(room.room_id).emit(startEmit, counter) // start phase
        counter--

        if (counter <= 0) {
          io.to(room.room_id).emit(cleanEmit) // clean up
          phaseAdvance(nextPhase) // next phase
          clearInterval(timer)
        }
      }, 1000)
    }


    // PHASE ADVANCER
    function phaseAdvance(phase) {
      if (phase === 'trivia') {
        trivia()
      } else if (phase === 'victory') {
        victory()
      }
    }

    function trivia() {
      io.to(room.room_id).emit('trivia-game-start')
      gameTimer('start-trivia-timer', 'remove-trivia', 'victory', 60)
    }

    function victory() {
      console.log('client announcing-victory')
      let players = handlers.handleGetLobbyPlayers(room.room_id)
      console.log('players', players)
      io.to(room.room_id).emit('create-victory', handlers.handleGetVictory(players, room))
    }


    // // TIMER 1   // skateboard baby
    // client.on('timer1', (counter) => {
    // let counter = 5
    // let timer = setInterval(function () {
    //   io.to(room.room_id).emit('counter1', counter)   //  temporary change - should be io.sockets.emit later
    //   counter--

    //   if (counter <= 0) {
    //     io.to(room.room_id).emit('counter-finish1')  // temporary change - should be io.sockets.emit  later
    //     io.to(room.room_id).emit('trivia-game-start')
    //     clearInterval(timer)
    //   }
    // }, 1000)

    // })

    // TIMER 2   // skateboard baby
    // client.on('timer2', (counter) => {

    //   let timer = setInterval(function () {
    //     io.to(room.room_id).emit('counter2', counter)   //  temporary change - should be io.sockets.emit later
    //     counter--

    //     if (counter <= 0) {
    //       io.to(room.room_id).emit('counter-finish2')  // temporary change - should be io.sockets.emit  later
    //       io.to(room.room_id).emit('announce-victory')
    //       clearInterval(timer)
    //     }
    //   }, 1000)
    // })


    // TRIVIA
    client.on('game-start', () => {
      io.to(client.id).emit('trivia-game-start')
    })

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
    // client.on('announce-victory', () => {
    //   console.log('clien announcing-victory')
    //   let players = handlers.handleGetLobbyPlayers(room.room_id)
    //   console.log('players', players)
    //   io.to(room.room_id).emit('create-victory', handlers.handleGetVictory(players), room)
    // })


  })

})

const PORT = process.env.PORT || 8000

server.listen(PORT, () => console.log(`server should be running at http://localhost:${PORT}/`))
