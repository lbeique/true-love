const socket = io.connect();


socket.emit('join-room', ROOM_ID, ROOM_NAME, ROOM_CODE, USER_ID, USER_NAME)


// ERROR

socket.on('error', function (err) {
    console.log('received socket error:', err);
})

// JOIN

socket.on('user-joined', user => {
    
    console.log('user joined', user)
})


// LEAVE

socket.on('user-disconnected', user => {
    
    console.log('user disconnected', user)
})