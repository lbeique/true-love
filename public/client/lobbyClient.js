const socket = io.connect();

// user list helper function

function userList(room) { // USER LIST
    const user__listContainer = document.querySelector('.lobby__userListContainer')

    user__listContainer.innerHTML = ''
    
    let clients = room.clients
    console.log(clients)

    for (const client in clients) {
        console.log(clients[client].username)

        const userContainer = document.createElement('div')
        const user__name = document.createElement('div')
        const user__avatarContainer = document.createElement('div')
        const user__avatar = document.createElement('img')

        userContainer.classList.add('user__container')
        user__name.classList.add('user__name', 'btn--darkPurple')
        user__avatarContainer.classList.add('user__avatarContainer')
        user__avatar.classList.add('user__avatar')


        user__name.innerText = clients[client].username
        user__avatar.innerText = clients[client].avatar


        user__avatarContainer.appendChild(user__avatar)
        userContainer.appendChild(user__avatarContainer)
        userContainer.appendChild(user__name)
        user__listContainer.appendChild(userContainer)

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

socket.on('create-lobby', (room, userId) => {
    const hostID = room.creator_id
    
    const section__lobbyClient = document.querySelector('.section-lobbyClient')

    const lobby__container = document.createElement('div')
    const lobby__leftContainer = document.createElement('div')
    const lobby__rightContainer = document.createElement('div')
    const lobby__header = document.createElement('h1')
    const lobby__code = document.createElement('div')
    const gameStart__header = document.createElement('h2')
    const gameStart__btn = document.createElement('button')
    const lobby__userListContainer = document.createElement('div')
    const lobby__backBtn = document.createElement('a')


    lobby__container.classList.add('lobby__container')
    lobby__leftContainer .classList.add('lobby__leftContainer')
    lobby__rightContainer .classList.add('lobby__rightContainer')
    lobby__header.classList.add('heading-primary', 'lobby__header')
    lobby__code.classList.add('lobby__code')
    gameStart__header.classList.add('heading-tertiary','lobby__startBtn-Header')
    gameStart__btn.classList.add('btn', 'lobby__startBtn')
    lobby__userListContainer.classList.add('lobby__userListContainer')
    lobby__backBtn.classList.add('btn', 'lobby__backButton', 'btn--darkPurple')
    

    lobby__header.innerText = `Welcome to the Lobby: ${room.room_name}`
    lobby__code.innerHTML = `The Lobby Code is: <span>${room.room_code} </span>`
    gameStart__header.innerText = 'Ready?'
    gameStart__btn.innerHTML= '<i class="fa-solid fa-play"></i>'
    lobby__backBtn.innerHTML= '<span>&#8618;</span>'
    lobby__backBtn.href = '/lobby'

   
    lobby__leftContainer.appendChild(lobby__code)
    lobby__leftContainer.appendChild(gameStart__header)
    lobby__leftContainer.appendChild(gameStart__btn)
    lobby__rightContainer.appendChild(lobby__header)
    lobby__rightContainer.appendChild(lobby__userListContainer)
    lobby__container.appendChild(lobby__leftContainer)
    lobby__container.appendChild(lobby__rightContainer)
    lobby__container.appendChild(lobby__backBtn)


    section__lobbyClient.appendChild(lobby__container)
   

    gameStart__btn.addEventListener('click', (event) => {
        event.preventDefault();
        socket.emit('voting-start')
    })


    console.log("USER ID", userId, "HOST ID", hostID)
    if(+userId !== hostID){ // Stef: if client is not the host, don't see this button, will have to change logic
        gameStart__btn.remove()
    }

    section__lobbyClient.classList.remove('hide')
    userList(room)
})


socket.on('remove-lobby', () => {
    const lobby__container = document.querySelector('.lobby__container')
    const section__lobbyClient = document.querySelector('.section-lobbyClient')

    lobby__container.remove()
    section__lobbyClient.classList.add('hide')
})


// WILL WAIT ON NEW EJS - Laurent
socket.on('host-transfer', (hostName) => {
    console.log('host transfered to', hostName)
    const gameStart__btn = document.createElement('button')
    gameStart__btn.classList.add('btn', 'btn-success')
    gameStart__btn.innerText = 'Start Game'
    gameStart__btn.addEventListener('click', (event) => {
        event.preventDefault();
        socket.emit('voting-start')
    })
})