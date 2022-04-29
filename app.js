require('dotenv').config()

const express = require("express")
const bodyParser = require("body-parser")
const session = require("express-session")
const app = express()

const server = require('http').createServer(app);
const socket = require('socket.io');
const io = socket(server);


const handlers = require('./server/handlers');

// Routes
const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const triviaRouter = require('./routes/trivia')
const mainMenuRouter = require('./routes/mainmenu')
const lobbyRouter = require('./routes/lobby')
const leaderboardRouter = require('./routes/leaderboard')


// Session Set-up
const sessionMiddleware = session({
    secret: `${process.env.SESSION_USER_KEYS}`,
    resave: false,
    saveUninitialized: false
});

// Conflict Oh no
app.use(sessionMiddleware)
app.set('view engine', 'ejs')
app.use(express.static("./public"))
app.use(bodyParser.urlencoded({ extended: false }))



// socket router stuff
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));


io.use((socket, next) => {
    const session = socket.request.session;
    console.log(session)
    if (session && session.authenticated) {
        next();
    } else {
        next(new Error("unauthorized"));
    }
});

// SUPER IMPORTANT TO PUT THESE AT THE END OF APP.USE
app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/trivia', triviaRouter)
app.use('/leaderboard', leaderboardRouter)
app.use('/mainmenu', mainMenuRouter)
app.use('/lobby', lobbyRouter)


// SOCKET STUFF
const activeUsers = {}
const activeRooms = {}

// const handlers = require('./handlers');

io.on('connection', client => {

    console.log(`on-connection, user connected with clientid: ${client.id}`)



    // client.on('join-room', (roomId, userId) => {

    // })

    // client.on('room-create', (roomId) => {
    //     console.log(`${roomId}`)
    // })

    // // * Listen to any events from client and call the appropriate handler functions
    // client.on('join', handlers.handleServerJoin(client));
  
  
    // client.on('disconnect', handlers.handleServerDisconnect(client));
    
  
    // client.on('error', (err) => {
    //   console.log('received error from client', client.id);
    //   console.log(err);
    // })
  
  
    // TIMER
    client.on('timer', () => {
  
      let timer = setInterval(function (counter) { 
        io.sockets.emit('counter', counter);     
        counter--;
    
        if (counter <= 0) {
          io.sockets.emit('counter-finish', 'game finish');
          clearInterval(timer);
        }
      }, 1000);
    })
  
  
    // TRIVIA
    client.on('trivia_question', (triviasArr) => {
      io.to(client.id).emit('trivia_start', handlers.handleTrivia(client, triviasArr))
    })
  
    client.on('trivia_check_answer', (data) => {
      io.to(client.id).emit('trivia_reset_state', handlers.checkTriviaAnswer(client, data.correct_answer, data.userAnswer)) // return true/false
    })
  
    client.on('trivia_next_question', () => {
      io.to(client.id).emit('trivia_start', handlers.nextTrivia(client)) 
    })
  


})

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => console.log(`server should be running at http://localhost:${PORT}/`));

// module.exports = app
