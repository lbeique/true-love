const socket = io.connect();

// socket.emit('timer', 60)

socket.emit('request word')

