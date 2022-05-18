const socket = io.connect();
// MUSIC

let triviaTrack = null

const music = {
    lobby: new Howl({
        src: ['../assets/sounds/music/Jahzzar - Take Me Higher.mp3'],
        html5: true,
        volume: 0.8,
        onfade: function () {
            music.lobby.stop()
            music.lobby.volume(0.8)
        }
    }),
    trivia1: new Howl({
        src: ['../assets/sounds/music/Crowander - Gypsy.mp3'],
        html5: true,
        volume: 0.8,
        onfade: function () {
            music.trivia1.stop()
            music.trivia1.volume(0.8)
        }
    }),
    trivia2: new Howl({
        src: ["../assets/sounds/music/G.G. Allin's Dick - Pollita Española.mp3"],
        html5: true,
        volume: 0.8,
        onfade: function () {
            music.trivia2.stop()
            music.trivia2.volume(0.8)
        }
    }),
    trivia3: new Howl({
        src: ['../assets/sounds/music/Sasha Mishkin - Heimweh Polka.mp3'],
        html5: true,
        volume: 0.8,
        onfade: function () {
            music.trivia3.stop()
            music.trivia3.volume(0.8)
        }
    }),
    trivia4: new Howl({
        src: ['../assets/sounds/music/Tintamare - Propane.mp3'],
        html5: true,
        volume: 0.8,
        onfade: function () {
            music.trivia4.stop()
            music.trivia4.volume(0.8)
        }
    }),
    lounge: new Howl({
        src: ['../assets/sounds/music/Crowander - Klezmer.mp3'],
        html5: true,
        volume: 0.8,
        onfade: function () {
            music.lounge.stop()
            music.lounge.volume(0.8)
        }
    }),
    victory: new Howl({
        src: ['../assets/sounds/music/Crowander - American.mp3'],
        html5: true,
        onfade: function () {
            music.victory.stop()
            music.victory.volume(0.8)
        }
    }),
}

const sfx = {
    positive: new Howl({
        src: ['../assets/sounds/sfx/close.mp3'],
        volume: 0.3,
    }),
    join: new Howl({
        src: ['../assets/sounds/sfx/join.mp3']
    }),
    expand: new Howl({
        src: ['../assets/sounds/sfx/expand.mp3']
    }),
    minimize: new Howl({
        src: ['../assets/sounds/sfx/minimize.mp3']
    }),
    error: new Howl({
        src: ['../assets/sounds/sfx/error.mp3']
    }),
    timer: new Howl({
        src: ['../assets/sounds/sfx/clock.mp3']
    }),
}

// music helper function

function setTriviaTrack() {
    let tracks = [music.trivia1, music.trivia2, music.trivia3]
    triviaTrack = tracks[Math.floor(Math.random() * tracks.length)]
}

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
        user__avatar.src = `assets/user-avatars/avatar_${clients[client].avatar}.png`

        user__avatarContainer.appendChild(user__avatar)
        userContainer.appendChild(user__avatarContainer)
        userContainer.appendChild(user__name)
        user__listContainer.appendChild(userContainer)

    }
}

socket.emit('join-room', ROOM_ID, USER_ID, USER_NAME, AVATAR_NAME)

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
    console.log('i fired')
    music.lobby.loop(true).play()
    setTriviaTrack()

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
    lobby__leftContainer.classList.add('lobby__leftContainer')
    lobby__rightContainer.classList.add('lobby__rightContainer')
    lobby__header.classList.add('heading-primary', 'lobby__header')
    lobby__code.classList.add('lobby__code')
    gameStart__header.classList.add('heading-tertiary', 'lobby__startBtn-Header')
    gameStart__btn.classList.add('btn', 'lobby__startBtn')
    lobby__userListContainer.classList.add('lobby__userListContainer')
    lobby__backBtn.classList.add('btn', 'lobby__backButton', 'btn--darkPurple')


    lobby__header.innerText = `Welcome to the Lobby: ${room.room_name}`
    lobby__code.innerHTML = `The Lobby Code is: <span>${room.room_code} </span>`
    gameStart__header.innerText = 'Ready?'
    gameStart__btn.innerHTML = '<i class="fa-solid fa-play"></i>'
    lobby__backBtn.innerHTML = '<span>&#8618;</span>'
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
        sfx.join.play()
        socket.emit('voting-start')
    })


    console.log("USER ID", userId, "HOST ID", hostID)
    if (+userId !== hostID) { // Stef: if client is not the host, don't see this button, will have to change logic
        gameStart__btn.remove()
    }

    section__lobbyClient.classList.remove('hide')
    userList(room)
})


socket.on('remove-lobby', () => {
    music.lobby.fade(1, 0, 500)
    const lobby__container = document.querySelector('.lobby__container')
    const section__lobbyClient = document.querySelector('.section-lobbyClient')

    lobby__container.remove()
    section__lobbyClient.classList.add('hide')
})



socket.on('host-transfer', (host, phase) => {
    console.log(phase)
    if (phase === 'lobby') {
        console.log('host transfered to', host.username)
        const lobby__leftContainer = document.querySelector('.lobby__leftContainer')
        const gameStart__btn = document.createElement('button')
        gameStart__btn.classList.add('btn', 'lobby__startBtn')
        gameStart__btn.innerHTML = '<i class="fa-solid fa-play"></i>'
        lobby__leftContainer.appendChild(gameStart__btn)
        gameStart__btn.addEventListener('click', (event) => {
            event.preventDefault();
            sfx.join.play()
            socket.emit('voting-start')
        })
    }
})

// REDIRECT
socket.on('redirect-to-lobbylist', () => {
    // redirect to new URL
    window.location = "/lobby"
});