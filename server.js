require('dotenv').config()
const app = require('./app.js'); 
const server = require('http').createServer(app);
const socket = require('socket.io');
const io = socket(server);

const PORT = process.env.PORT || 8000;


const handlers = require('./server/handlers');



// Handle socket from web clients
io.on('connection', (client) => {  // client = socket
  
  console.log('a user connected');

  // * Listen to any events from client and call the appropriate handler functions
  io.emit('join', handlers.handleJoin(client));


  client.on('disconnect', () => {
    io.emit('leave', handlers.handleDisconnect(client));
  });
  

  client.on('error', (err) => {
    console.log('received error from client', client.id);
    console.log(err);
  })


  // TIMER
  client.on('timer', () => {
    let counter = 30

    let timer = setInterval(function () { 
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
    io.emit('trivia_start', handlers.handleTrivia(client, triviasArr))
  })

  client.on('trivia_check_answer', (data) => {
    io.to(client.id).emit('trivia_reset_state', handlers.checkTriviaAnswer(client, data.correct_answer, data.userAnswer)) // return true/false
  })

  client.on('trivia_next_question', () => {
    io.to(client.id).emit('trivia_start', handlers.nextTrivia(client)) 
  })



});


server.listen(PORT, () => console.log(`server should be running at http://localhost:${PORT}/`));


module.exports = { io, PORT };