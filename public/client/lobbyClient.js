const socket = io.connect();



// user list helper function

function userList(room) {
    const user__list = document.querySelector('.user__list')

    user__list.innerHTML = ''

    let clients = room.clients
    console.log(clients)

    for (const client in clients) {
        console.log(clients[client].username)

        const user = document.createElement('div')
        user.classList.add('user')

        const userName__PTag = document.createElement('p')
        userName__PTag.innerText = clients[client].username

        const userAvatar = document.createElement('div')
        const userAvatar__PTag = document.createElement('p')
        userAvatar__PTag.innerText = clients[client].avatar

        userAvatar.appendChild(userAvatar__PTag)

        user.appendChild(userName__PTag)
        user__list.appendChild(user)
        user__list.appendChild(userAvatar)

    }
}

socket.emit('join-room', ROOM_ID, USER_ID, USER_NAME)

// ERROR

socket.on('error', function (err) {
    console.log('received socket error:', err);
})


// JOIN

socket.on('user-joined', (user, room) => {
    console.log('user joined', user)
    userList(room)
})

// LEAVE

socket.on('user-disconnected', (user, room) => {
    console.log('user left', user)
    userList(room)
})

socket.on('create-lobby', (room) => {
    const section__main = document.querySelector('.section-main--bg1')

    const lobby__container = document.createElement('div')
    lobby__container.classList.add('lobby__container')

    const lobby__header = document.createElement('h1')
    lobby__header.innerText = `Welcome to the Lobby: ${room.room_name}`

    const lobby__code = document.createElement('p')
    lobby__code.innerText = `The Lobby Code is: ${room.room_code}`

    const gameStart__btn = document.createElement('button')
    gameStart__btn.classList.add('btn', 'btn-success')
    gameStart__btn.innerText = 'Start Game'

    const user__list = document.createElement('div')
    user__list.classList.add('user__list')
   
    lobby__container.appendChild(lobby__header)
    lobby__container.appendChild(lobby__code)
    lobby__container.appendChild(gameStart__btn)
    section__main.appendChild(lobby__container)
    section__main.appendChild(user__list)

    gameStart__btn.addEventListener('click', (event) => {
        event.preventDefault();
        socket.emit('game-start')
    })

})

socket.on('remove-lobby', () => {
    const lobby__container = document.querySelector('.lobby__container')
    lobby__container.remove()
})