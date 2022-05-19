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
app.use(bodyParser.json());



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
  client.on('join-room', (roomId, userId, userName, avatarName) => {

    let user = handlers.handleServerJoin(client, userId, userName, avatarName)
    console.log('join-room user: ', user)
    if (!user) {
      // NEED TO DEAL WITH USERS HERE (handler failed to join user) - Laurent
      io.to(client.id).emit('redirect-to-lobbylist')
      return
    }

    let room = handlers.handleGetLobbyFromId(roomId)
    if (!room) {
      // NEED TO DEAL WITH USERS HERE (handler failed to get room) - Laurent
      io.to(client.id).emit('redirect-to-lobbylist')
      return
    } else if (room.gameState.game_active === true) {
      // NEED TO DEAL WITH USERS HERE (game is currently active) - Laurent
      io.to(client.id).emit('redirect-to-lobbylist')
      return
    }

    let clients = room.clients

    for (const client in clients) {
      if (clients[client].userId === user.userId) {
        // NEED TO DEAL WITH USERS HERE (user is already in the game) - Laurent
        io.to(client.id).emit('redirect-to-lobbylist')
        return
      }
    }


    // CREATE LOBBY
    io.to(client.id).emit('create-lobby', room, user.userId)
    // console.log(`${client.id} emit create-lobby -> handle lobby-join`)
    handlers.handleLobbyJoin(roomId, client)
    // console.log(`${client.id} handle-lobby-join -> client.join-room`)
    client.join(room.room_id)
    // console.log(`${client.id} client.join-room -> emit user-joined`)
    io.to(room.room_id).emit('user-joined', user, room)
    console.log(`on-join-room, user ${user.username} connected to room ${room.room_id} with clientid: ${user.socketId}`)


    // SERVER DISCONNECT
    client.on('disconnect', () => {
      let players = room.clients
      if (room.creator_id === user.userId) {
        console.log('host left the game')
        let transfer = false

        for (const player in players) {
          if (!transfer) {
            if (players[player].userId !== user.userId) {
              console.log('new host', players[player].userId)
              handlers.handleLobbyTransfer(room.room_id, players[player])
              io.to(players[player].socketId).emit('host-transfer', room.creator_name, room.gameState.phase)
              transfer = true
            }
          }
        }
        transfer = false
      }
      if (room.gameState.game_active === false) {
        handlers.handleLobbyDisconnect(room.room_id, client)
        io.to(room.room_id).emit(`user-disconnected`, user, room)
      } else if (room.gameState.game_active === true) {
        handlers.handleLeavingGameInProgress(room, client)
        if (room.gameState.phase === 'voting') {
          console.log(room.gameState.phase)
          const checkVotingState = handlers.handleVote(null, user, room, 1)
          voting(checkVotingState)
        } else if (room.gameState.phase === 'lounge') {

          // we might need a possible stop at lounge, need to address if a person leaves -- Laurent
        }
      }
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
      room.gameState.phase = 'voting'
      //console.log('gameState update, number of players fixed update')
      handlers.handleCreateLeaderboard(room) // also sets game_active to true
      console.log('crush start emit')
      io.to(room.room_id).emit('crush-start', handlers.handleCrushes(room))
    })

    // CRUSHES
    client.on('room_clients', () => {
      io.to(client.id).emit('receive room_clients', room)
    })


    // CRUSHES TRANSITION
    client.on('voted_crush', (votedCrush) => {
      const checkVotingState = handlers.handleVote(votedCrush, user, room, null)
      console.log(checkVotingState)
      voting(checkVotingState)
    })


    // LOBBY PLAYER READY
    client.on('player-ready', (transfer) => {
      const readyStatus = handlers.handlePlayerReady(user, room, transfer)
      lobbyReady(readyStatus)
    })



    ////////////////// SKATEBOARD HELPER FUNCTIONS /////////////////

     // PLAYERS READY
     function lobbyReady(readyStatus) {
      if (!readyStatus.gameready) {
        io.to(room.room_id).emit('user_ready_client', readyStatus.userId, room)
      } else {
        io.to(room.room_id).emit('user_ready_client', readyStatus.userId, room)
        io.to(room.room_id).emit('all_users_ready', user.userId, room) 
      }
    }

    // GAME TIMER (used to advance phase)
    function gameTimer(startEmit, cleanEmit, nextPhase, counter, triviaInfo) {
      // trivia info alternates between category info and result info
      room.phase = 'trivia'
      let timer = setInterval(function () {
        io.to(room.room_id).emit(startEmit, counter, triviaInfo) // start phase
        counter--

        if (counter < 0) {
          io.to(room.room_id).emit(cleanEmit) // clean up
          phaseAdvance(nextPhase) // next phase
          clearInterval(timer)
        }
      }, 1000)
    }

    // PHASE VOTING
    function voting(checkVotingState) {
      if (typeof checkVotingState === "number") {
        io.to(room.room_id).emit('client_voted', checkVotingState)
      } else {
        io.to(room.room_id).emit('client_voted', checkVotingState.clientId)
        console.log('crush id', checkVotingState.topVotedCrush.id)
        let crush = handlers.handleGetCrushFromId(checkVotingState.topVotedCrush.id)
        let tempCrush = { ...crush }
        delete tempCrush.categoryHard
        //console.log('tempCrush', tempCrush)
        io.to(room.room_id).emit('crush_voting_result', tempCrush)
        setTimeout(() => {
          //console.log('set timeout voted_crush')
          gameTimer('start-crush-timer', 'remove-crush', 'trivia', 5, tempCrush.categoryEasy.name)
        }, 3000)
      }
    }


    // PHASE TRIVIA
    async function trivia(triviaInfo) {
      let { amount, id, difficulty } = triviaInfo
      let nextPhase = null
      room.gameState.phase = 'trivia'
      if (room.gameState.triviaIndex < 2) {
        nextPhase = 'lounge'
      } else if (room.gameState.triviaIndex === 2) {
        nextPhase = 'victory'
      }
      console.log('trivia phase start')
      // const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&category=${id}&difficulty=${difficulty}&type=multiple&token=${room.token}`)

      console.log('amount', amount, 'id', id, 'difficulty', difficulty)

      const response = await fetch(`https://the-trivia-api.com/api/questions?categories=${id}&limit=${amount}&difficulty=${difficulty}`)
      const data = await response.json()

      console.log('api data', data.length)
      // console.log('api data', data)

      // console.log(data.results)

      // if (data.response_code === 4) {
      //   await fetch(`https://opentdb.com/api_token.php?command=reset&token=${token}`)
      //   response = await fetch(`https://opentdb.com/api.php?amount=${amount}&category=${id}&difficulty=${difficulty}&type=multiple&token=${room.token}`)
      //   data = await response.json()
      // }

      let clientTriviaQuestions = handlers.handleTrivia(data, room)

      // console.log('clientTriviaQuestions', clientTriviaQuestions)

      const sidebarTriviaData = {
        leaderboard: handlers.handleUpdateLeaderboard(room),
        phase: room.gameState.phase
      }

      io.to(room.room_id).emit('setup-sidebar-trivia', sidebarTriviaData)
      io.to(room.room_id).emit('start-trivia-music', room.gameState.triviaIndex)
      io.to(room.room_id).emit('trivia-question', clientTriviaQuestions[0], 0, 0)
      gameTimer('start-trivia-timer', 'remove-trivia', nextPhase, +process.env.TRIVIA_COUNT)
    }


    // PHASE LOUNGE
    function lounge(gameInfo) {
      let nextTrivia = gameInfo.nextTrivia
      room.gameState.phase = 'lounge'
      room.gameState.triviaIndex++
      io.to(room.room_id).emit('create-lounge', gameInfo)

      io.to(room.room_id).emit('setup-sidebar-lounge', room.gameState.phase)
      gameTimer('start-lounge-timer', 'remove-lounge', 'trivia', +process.env.LOUNGE_COUNT, nextTrivia)

    }


    // PHASE VICTORY
    async function victory() {

      console.log('victory phase start')
      room.gameState.phase = 'trivia'
      // await handlers.handleGameSave(room)
      const victoryObject = await handlers.handleGetVictory(room)

      io.to(room.room_id).emit('create-victory', victoryObject)
    }


    // PHASE ADVANCER
    function phaseAdvance(phase) {
      let triviaInfo = null
      let gameInfo = null
      if (Object.keys(room.clients).length) {
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
          let leaderboard = handlers.handleUpdateLeaderboard(room)
          if (room.gameState.triviaIndex === 0) {
            let dialogue = analytics(room, leaderboard, null)
            let nextTrivia = room.gameState.topVotedCrush.categoryMedium.name
            gameInfo = handlers.handleLoungeGameInfo(room, leaderboard, dialogue, nextTrivia)

          } else if (room.gameState.triviaIndex === 1) {
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
