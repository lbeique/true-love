const socket = io.connect();


socket.emit('join-room', ROOM_ID, USER_ID, USER_NAME)

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

socket.on('create-lobby', (room) => {
    const lobby__container = document.createElement('div')
    lobby__container.classList.add('lobby__container')

    const lobby__header = document.createElement('h1')
    const lobby__code = document.createElement('p')
    const section__main = document.querySelector('.section-main--bg1')

    lobby__header.innerText = `Welcome to the Lobby: ${room.room_name}`
    lobby__code.innerText = `The Lobby Code is: ${room.room_code}`

    const gameStart__btn = document.createElement('button')
    gameStart__btn.classList.add('btn', 'btn-success')
    gameStart__btn.innerText = 'Start Game'

    lobby__container.appendChild(lobby__header)
    lobby__container.appendChild(lobby__code)
    lobby__container.appendChild(gameStart__btn)
    section__main.appendChild(lobby__container)



    // too tired to finish this part -- need to cycle through room users and display them. Probably needs to be on an interval so it continuously refreshes.
    
    // for (const client in room.clients) {

    // }

    gameStart__btn.addEventListener('click', (event) => {
        event.preventDefault();
        socket.emit('game-start')
    })

})

socket.on('remove-lobby', () => {
    const lobby__container = document.querySelector('.lobby__container')
    lobby__container.remove()
})