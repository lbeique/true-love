const socket = io.connect();


// ERROR

socket.on('error', function (err) {
    console.log('received socket error:', err);
})

// JOIN

socket.on('join', (users) => {

    
})



// LEAVE

socket.on('leave', (users) => {

    
})









