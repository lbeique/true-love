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
    const hostID = room.creator_id
    
    const section__lobbyClient = document.querySelector('.section__lobbyClient')

    const lobby__container = document.createElement('div')
    lobby__container.classList.add('lobby__container')

    const lobby__header = document.createElement('h1')
    lobby__header.innerText = `Welcome to the Lobby: ${room.room_name}`

    const lobby__code = document.createElement('p')
    lobby__code.innerText = `The Lobby Code is: ${room.room_code}`

    const gameStart__btn = document.createElement('button')
    gameStart__btn.classList.add('btn', 'btn-success')
    gameStart__btn.innerText = 'Start Game'

    ////////////////////////////////////////////////////////
    // THIS IS TEMPORARY - I WANT FRIENDS
    const addFriends__btn = document.createElement('button')
    addFriends__btn.classList.add('btn', 'btn-success')
    addFriends__btn.innerText = 'I WANT FRIENDS'
    // 
    ////////////////////////////////////////////////////////

    const user__list = document.createElement('div')
    user__list.classList.add('user__list')
   
    lobby__container.appendChild(lobby__header)
    lobby__container.appendChild(lobby__code)
    lobby__container.appendChild(gameStart__btn)

    ////////////////////////////////////////////////////////
    // THIS BUTTON IS TEMPORARY - I WANT FRIENDS
    lobby__container.appendChild(addFriends__btn)
    //
    ////////////////////////////////////////////////////////

    lobby__container.appendChild(user__list)
    section__lobbyClient.appendChild(lobby__container)
   
    gameStart__btn.addEventListener('click', (event) => {
        event.preventDefault();
        socket.emit('voting-start')
    })

    console.log("USER ID", USER_ID, "HOST ID", hostID)
    if(+USER_ID !== hostID){ // if client is not the host, don't see this button
        gameStart__btn.remove()
    }
    
    ////////////////////////////////////////////////////////
    // THIS IS TEMPORARY - I WANT FRIENDS
    addFriends__btn.addEventListener('click', (event) => {
        event.preventDefault();
        socket.emit('I-Want-Friends')
    })
    //   
    //////////////////////////////////////////////////////// 

    section__lobbyClient.classList.remove('hide')
    userList(room)
})


socket.on('remove-lobby', () => {
    const lobby__container = document.querySelector('.lobby__container')
    const section__lobbyClient = document.querySelector('.section__lobbyClient')

    lobby__container.remove()
    section__lobbyClient.classList.add('hide')
})