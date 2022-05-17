require('dotenv').config()

const express = require("express")
const bodyParser = require("body-parser")
const session = require("express-session")
const app = express()

const server = require('http').createServer(app)
const socket = require('socket.io')
const io = socket(server)

const fetch = require('node-fetch')

const handlers = require('./server/handlers')
const { analytics } = require('./server/analytics')

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



// some socket router stuff
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

// app use Routes
app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/leaderboard', leaderboardRouter)
app.use('/mainmenu', mainMenuRouter)
app.use('/lobby', lobbyRouter)



// THE REAL SOCKETS STUFF BEGINS HERE
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
      // NEED TO DEAL WITH USERS HERE (handler failed to join user) - Laurent
      return
    }

    let room = handlers.handleGetLobbyFromId(roomId)
    if (!room) {
      // NEED TO DEAL WITH USERS HERE (handler failed to get room) - Laurent
      return
    } else if (room.gameState.game_active === true) {
      // NEED TO DEAL WITH USERS HERE (game is currently active) - Laurent
      return
    }

    let clients = room.clients

    for (const client in clients) {
      if (clients[client].userId === user.userId) {
        // NEED TO DEAL WITH USERS HERE (user is already in the game) - Laurent
        return
      }
    }


    // CREATE LOBBY
    io.to(client.id).emit('create-lobby', room, user.userId)
    console.log(`${client.id} emit create-lobby -> handle lobby-join`, room)
    handlers.handleLobbyJoin(roomId, client)
    console.log(`${client.id} handle-lobby-join -> client.join-room`, room)
    client.join(room.room_id)
    console.log(`${client.id} client.join-room -> emit user-joined`, room)
    io.to(room.room_id).emit('user-joined', user, room)
    console.log(`on-join-room, user ${user.username} connected to room ${room.room_id} with clientid: ${user.socketId}`)


    // SERVER DISCONNECT
    client.on('disconnect', () => {
      if (room.creator_id === user.userId) {
        handlers.handleLobbyDisconnect(room.room_id, client)
        if (room.gameState.game_active === false) {
          let newHost = handlers.handleGetUserFromUserId(room.creator_id)
          io.to(newHost.socketId).emit('host-transfer', newHost.username)
        }
      } else {
        handlers.handleLobbyDisconnect(room.room_id, client)
      }
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
      handlers.handleCreateLeaderboard(room) // sets game_active to true
      handlers.handleCreateLobby
      console.log('crush start emit')
      io.to(room.room_id).emit('crush-start', handlers.handleCrushes(room))
    })

    // CRUSHES
    client.on('room_clients', () => {
      io.to(client.id).emit('receive room_clients', room)
    })


    // CRUSHES TRANSITION
    client.on('voted_crush', (votedCrush) => {
      const checkVotingState = handlers.handleVote(votedCrush, user, room)
      console.log(checkVotingState)
      if (typeof checkVotingState === "string") {
        io.to(room.room_id).emit('client_voted', checkVotingState)
      } else {
        io.to(room.room_id).emit('client_voted', checkVotingState.clientId)
        console.log('crush id', checkVotingState.topVotedCrush.id)
        let crush = handlers.handleGetCrushFromId(checkVotingState.topVotedCrush.id)
        let tempCrush = { ...crush }
        delete tempCrush.categoryHard
        console.log('tempCrush', tempCrush)
        io.to(room.room_id).emit('crush_voting_result', tempCrush)
        setTimeout(() => {
          console.log('set timeout voted_crush')
          gameTimer('start-crush-timer', 'remove-crush', 'trivia', 5, tempCrush.categoryEasy.name)
        }, 3000);
      }
    })


    ////////////////// SKATEBOARD HELPER FUNCTIONS /////////////////

    // GAME TIMER (used to advance phase)
    function gameTimer(startEmit, cleanEmit, nextPhase, counter, triviaInfo) {
      // trivia info alternates between category info and result info
      let timer = setInterval(function () {
        io.to(room.room_id).emit(startEmit, counter, triviaInfo) // start phase
        counter--

        if (counter <= 0) {
          io.to(room.room_id).emit(cleanEmit) // clean up
          phaseAdvance(nextPhase) // next phase
          clearInterval(timer)
        }
      }, 1000)
    }


    // PHASE TRIVIA
    async function trivia(triviaInfo) {
      let { amount, id, difficulty } = triviaInfo
      let nextPhase = null
      if (room.gameState.triviaIndex < 2) {
        nextPhase = 'lounge'
      } else if (room.gameState.triviaIndex === 2) {
        nextPhase = 'victory'
      }
      console.log('trivia phase start')
      const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&category=${id}&difficulty=${difficulty}&type=multiple&token=${room.token}`)
      const data = await response.json()

      // console.log(data.results)

      if (data.response_code === 4) {
        await fetch(`https://opentdb.com/api_token.php?command=reset&token=${token}`)
        response = await fetch(`https://opentdb.com/api.php?amount=${amount}&category=${id}&difficulty=${difficulty}&type=multiple&token=${room.token}`)
        data = await response.json()
      }

      let clientTriviaQuestions = handlers.handleTrivia(data.results, room)

      console.log('clientTriviaQuestions', clientTriviaQuestions)
      
      io.to(room.room_id).emit('setup-sidebar-trivia', handlers.handleUpdateLeaderboard(room))
      io.to(room.room_id).emit('start-trivia-music', room.gameState.triviaIndex)
      io.to(room.room_id).emit('trivia-question', clientTriviaQuestions[0], 0, 0)
      gameTimer('start-trivia-timer', 'remove-trivia', nextPhase, +process.env.TRIVIA_COUNT)
    }


    // PHASE LOUNGE
    function lounge(gameInfo) {
      let nextTrivia = gameInfo.nextTrivia
      room.gameState.triviaIndex++
      io.to(room.room_id).emit('create-lounge', gameInfo)
      io.to(room.room_id).emit('setup-sidebar-lounge')
      gameTimer('start-lounge-timer', 'remove-lounge', 'trivia', 30, nextTrivia)
    }


    // PHASE VICTORY
    function victory() {
      // room.gameState.triviaIndex = 0
      console.log('victory phase start')
      let leaderboard = handlers.handleUpdateLeaderboard(room)
      console.log('final room', room)
      console.log('final room', room.gameState)
      console.log('final user', user)
      console.log('final user', user.game)
      console.log('final leaderboard', leaderboard)

      console.log('easy error', user.game.trivia.easy.errors)
      console.log('completed easy', user.game.trivia.easy.questions)
      console.log('medium error', user.game.trivia.medium.errors)
      console.log('completed medium', user.game.trivia.medium.questions)
      console.log('hard error', user.game.trivia.hard.errors)
      console.log('completed hard', user.game.trivia.hard.questions)
      io.to(room.room_id).emit('create-victory', handlers.handleGetVictory(room, leaderboard))
    }


    // PHASE ADVANCER
    function phaseAdvance(phase) {
      let triviaInfo = null
      let gameInfo = null
      if (phase === 'trivia') {
        if (room.gameState.triviaIndex === 0) {
          triviaInfo = room.gameState.topVotedCrush.categoryEasy
          triviaInfo.difficulty = 'easy'
          triviaInfo.amount = '20'
        } else if (room.gameState.triviaIndex === 1) {
          triviaInfo = room.gameState.topVotedCrush.categoryMedium
          triviaInfo.difficulty = 'medium'
          triviaInfo.amount = '20'
        } else if (room.gameState.triviaIndex === 2) {
          triviaInfo = room.gameState.topVotedCrush.categoryHard
          triviaInfo.difficulty = 'hard'
          triviaInfo.amount = '20'
        }
        trivia(triviaInfo)
        return

      } else if (phase === 'lounge') {
        if (room.gameState.triviaIndex === 0) {
          let leaderboard = handlers.handleUpdateLeaderboard(room)
          let dialogue = analytics(room, leaderboard, null)
          let nextTrivia = room.gameState.topVotedCrush.categoryMedium.name
          gameInfo = handlers.handleLoungeGameInfo(room, leaderboard, dialogue, nextTrivia)

        } else if (room.gameState.triviaIndex === 1) {
          let leaderboard = handlers.handleUpdateLeaderboard(room)
          let dialogue = analytics(room, null, leaderboard)
          let nextTrivia = room.gameState.topVotedCrush.categoryHard.name
          gameInfo = handlers.handleLoungeGameInfo(room, leaderboard, dialogue, nextTrivia)
        }
        lounge(gameInfo)
        return

      } else if (phase === 'victory') {
        victory()
        return
      }
    }


    // TRIVIA
    client.on('trivia_check_answer', (answer) => {
      const data = handlers.checkTriviaAnswer(user, room, answer)
      if (!data.result) {
        // do a client emit to trigger RED X and sound
        io.to(client.id).emit('trivia_false')
      } else if (data.result) {
        const { nextTrivia, animate } = handlers.nextTrivia(user, room)
        // client emit for next question and game juice
        io.to(client.id).emit('trivia-question', nextTrivia, animate, data.points)
        // server emit for leaderboard placement
        let leaderboard = handlers.handleUpdateLeaderboard(room)
        io.to(room.room_id).emit("update-leaderboard", leaderboard)
      }
    })

    // // io.to(client.id).emit('trivia_reset_state', data)

    // client.on('trivia_next_question', () => {
    //   const { nextTrivia, animate } = handlers.nextTrivia(user, room)
    //   console.log(nextTrivia)
    //   io.to(client.id).emit('trivia-question', nextTrivia, animate)
    // })


    // RETURN TO LOBBY TRANSITION
    client.on('return-to-lobby', () => {
      console.log(`${client.id} emit return-to-lobby -> emit remove-victory`)
      io.to(client.id).emit('remove-victory')
      console.log(`${client.id} emit remove-victory -> emit create-lobby`)
      io.to(client.id).emit('create-lobby', room, user.userId)
    })
  })
})

const PORT = process.env.PORT || 8000

server.listen(PORT, () => console.log(`server should be running at http://localhost:${PORT}/`))
