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

});


server.listen(PORT, () => console.log(`server should be running at http://localhost:${PORT}/`));


module.exports = { io, PORT };