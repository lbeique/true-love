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


    let clients = room.clients
    console.log(clients)


    user__listContainer.innerHTML = ''

    for (const client in clients) {
        console.log(clients[client].username)

        const userContainer = document.createElement('div')
        const user__name = document.createElement('div')
        const user__avatarContainer = document.createElement('div')
        const user__avatar = document.createElement('img')

        userContainer.classList.add('user__container')

        user__name.classList.add('user__name', 'btn--darkPurple')
        user__name.id = clients[client].userId
        user__avatarContainer.classList.add(`player-${clients[client].userId}`, `user__avatarContainer`)

        if (clients[client].game.ready) {
            user__avatarContainer.classList.add('user__avatarContainer--readyGreen')
        }

        user__avatar.classList.add('user__avatar')

        user__name.innerText = clients[client].username
        user__avatar.src = `assets/user-avatars/avatar_${clients[client].avatar}.png`

        user__avatarContainer.appendChild(user__avatar)
        userContainer.appendChild(user__avatarContainer)
        userContainer.appendChild(user__name)

        user__listContainer.appendChild(userContainer)

    }
}

socket.on('create-kick-users', (room) => {
    const hostID = room.creator_id
    let userNameContainers = document.querySelectorAll('.user__name')
    userNameContainers.forEach(container => {
        console.log(container.lastChild)
        if (container.lastChild.nodeType !== Node.TEXT_NODE) {
            container.lastChild.remove()
        }
        let currentUserId = +container.id
        if (currentUserId !== hostID) {
            const kick__btn = document.createElement('button')
            kick__btn.classList.add('user__name--kick', `kick-${currentUserId}`)
            kick__btn.innerHTML = `<i id=${currentUserId} class="fa-solid fa-x"></i>`
            kick__btn.id = currentUserId
            container.appendChild(kick__btn)
        }
    })
})


function allUsersReadyEvent(event) {
    event.preventDefault();
    sfx.join.play()
    socket.emit('voting-start')
}


function kickUserHelper(event) {
    console.log(+event.target.id)
    event.preventDefault()
    if (event.target.classList.contains('fa-x')) {
        let userId = +event.target.id
        console.log('kick', userId)
        socket.emit('kick-player', (userId))
    }

}


socket.emit('join-room', ROOM_ID)

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
    music.lobby.loop(true).play()
    setTriviaTrack()

    const section__lobbyClient = document.querySelector('.section-lobbyClient')

    const lobby__container = document.createElement('div')
    const lobby__leftContainer = document.createElement('div')
    const lobby__rightContainer = document.createElement('div')
    const lobby__header = document.createElement('h1')
    const lobby__code = document.createElement('div')
    // const gameStart__header = document.createElement('h2')
    const gameStart__btn = document.createElement('button')
    const gameReady__btn = document.createElement('button')
    const lobby__userListContainer = document.createElement('div')
    const lobby__backBtn = document.createElement('a')


    lobby__container.classList.add('lobby__container')
    lobby__leftContainer.classList.add('lobby__leftContainer')
    lobby__rightContainer.classList.add('lobby__rightContainer')
    lobby__header.classList.add('heading-primary', 'lobby__header')
    lobby__code.classList.add('lobby__code')
    // gameStart__header.classList.add('lobby__startBtn-Header')
    gameStart__btn.classList.add('btn', 'lobby__startBtn')
    gameReady__btn.classList.add('btn', 'lobby__readyBtn')
    lobby__userListContainer.classList.add('lobby__userListContainer')
    lobby__backBtn.classList.add('btn', 'lobby__backButton', 'btn--darkPurple')


    lobby__header.innerText = `Welcome to the Lobby: ${room.room_name}`
    lobby__code.innerHTML = `The Lobby Code is: <span>${room.room_code}</span>`
    // gameStart__header.innerText = 'Not Ready'
    gameReady__btn.innerText = 'Not Ready'
    gameStart__btn.innerHTML = '<i class="fa-solid fa-play"></i>'
    lobby__backBtn.innerHTML = '<span>&#8618;</span>'
    lobby__backBtn.href = '/lobby'


    lobby__leftContainer.appendChild(lobby__code)
    // lobby__leftContainer.appendChild(gameStart__header)
    lobby__leftContainer.appendChild(gameReady__btn)
    lobby__rightContainer.appendChild(lobby__header)
    lobby__rightContainer.appendChild(lobby__userListContainer)
    lobby__container.appendChild(lobby__leftContainer)
    lobby__container.appendChild(lobby__rightContainer)
    lobby__container.appendChild(lobby__backBtn)

    section__lobbyClient.appendChild(lobby__container)

    function gameReadyHelper(event) {
        event.preventDefault()
        sfx.positive.play()
        //sfx.join.play()
        socket.emit(`player-ready`, null)
        console.log('player ready emit to server')
        setTimeout(() => { gameReady__btn.removeEventListener('click', gameReadyHelper) }, 0)
        setTimeout(() => { gameReady__btn.addEventListener('click', gameNotReadyHelper) }, 0)
    }

    function gameNotReadyHelper(event) {
        event.preventDefault()
        sfx.positive.play()
        //sfx.join.play()
        socket.emit(`player-not-ready`)
        console.log('player not ready emit to server')
        setTimeout(() => { gameReady__btn.removeEventListener('click', gameNotReadyHelper) }, 0)
        setTimeout(() => { gameReady__btn.addEventListener('click', gameReadyHelper) }, 0)
    }

    gameReady__btn.addEventListener('click', gameReadyHelper)

    userList(room)

    if (+userId === hostID) {
        lobby__leftContainer.appendChild(gameStart__btn)
        lobby__rightContainer.addEventListener('click', kickUserHelper)
    }



    console.log("USER ID", userId, "HOST ID", hostID)

    // if (+userId !== hostID) {
    //     // Stef: if client is not the host, don't see this button, will have to change logic
    //     // Lo: I like it haha
    //     console.log(lobby__userListContainer)
    //     let query__user__container = document.querySelectorAll('.user__container')
    //     query__user__container.forEach(node => {
    //         let userNodeId = +node.id
    //     });



    //     // console.log('node', query__user__container)

    //     // lobby__userListContainer.forEach(user__container => {
    //     //     let container_userId = null
    //     //     if (user__container.classList.contains('user__avatarContainer')) {
    //     //         console.log(user__container.classList[0])
    //     //     }
    //     //     user__container.forEach(username__container => {
    //     //         if (username__container.classList.contains('user__name--kick')) {
    //     //             username__container.querySelector('.user__name--kick')
    //     //         }

    //     //     });
    //     // });
    //     let kick__buttons = lobby__userListContainer.querySelectorAll('.user__name--kick')
    //     kick__buttons.forEach(element => {
    //         element.remove()
    //     });
    //     // gameStart__btn.remove()
    // }

    socket.emit(`player-not-ready`)

    section__lobbyClient.classList.remove('hide')

    // if (+userId === hostID) {
    //     let kick__buttons = lobby__userListContainer.querySelectorAll('user__name--kick')
    //     console.log('allo', kick__buttons)
    //     // lobby__userListContainer.forEach(element => {
    //     //     if (element.classList.contains('user__name--kick')) {
    //     //         for (let i = 0; i < classList.length; i++) {
    //     //             console.log(classList[i])

    //     //         }
    //     //     }
    //     // });

    // }

})


socket.on('remove-lobby', () => {
    music.lobby.fade(1, 0, 500)
    const lobby__container = document.querySelector('.lobby__container')
    const section__lobbyClient = document.querySelector('.section-lobbyClient')

    lobby__container.remove()
    section__lobbyClient.classList.add('hide')
})

// player ready
socket.on('user_ready_client', (userId) => {

    if (+USER_ID === userId) {
        const gameReady__btn = document.querySelector('.lobby__readyBtn')
        gameReady__btn.classList.add('lobby__readyBtn--readyGreen')
        gameReady__btn.innerText = 'Ready!'
    }

    // need to select appropriate avatar container and turn it greeeeen

    const user__avatarContainer = document.querySelector(`.player-${userId}`)
    user__avatarContainer.classList.add('user__avatarContainer--readyGreen')
})

// player not ready
socket.on('user_not_ready_client', (userId) => {

    if (+USER_ID === userId) {
        const gameReady__btn = document.querySelector('.lobby__readyBtn')
        gameReady__btn.classList.remove('lobby__readyBtn--readyGreen')
        gameReady__btn.innerText = 'Not Ready'
    }

    const user__avatarContainer = document.querySelector(`.player-${userId}`)
    user__avatarContainer.classList.remove('user__avatarContainer--readyGreen')
})

// all users ready
socket.on('all_users_ready', () => {

    const gameStart__btn = document.querySelector('.lobby__startBtn')
    gameStart__btn.classList.add('lobby__startBtn--readyGreen')


    gameStart__btn.addEventListener('click', allUsersReadyEvent)

})

// all users not ready
socket.on('all_users_not_ready', () => {


    const gameStart__btn = document.querySelector('.lobby__startBtn')
    gameStart__btn.classList.remove('lobby__startBtn--readyGreen')

    // now we make the inside of the botton green


    gameStart__btn.removeEventListener('click', allUsersReadyEvent)

})

// host transfer
socket.on('host-transfer', (host, phase) => {
    console.log(phase)
    if (phase === 'lobby') {
        console.log('host transfered to', host.username)
        socket.emit(`player-ready`, true)
        const lobby__leftContainer = document.querySelector('.lobby__leftContainer')
        const lobby__rightContainer = document.querySelector('.lobby__rightContainer')

        const gameStart__btn = document.createElement('button')
        gameStart__btn.classList.add('btn', 'lobby__startBtn')
        gameStart__btn.innerHTML = '<i class="fa-solid fa-play"></i>'

        lobby__leftContainer.appendChild(gameStart__btn)
        lobby__rightContainer.addEventListener('click', kickUserHelper)


        // let userNameContainers = document.querySelectorAll('.user__name')
        // userNameContainers.forEach(container => {
        //     if (container.lastChild.nodeType !== Node.TEXT_NODE) {
        //         container.lastChild.remove()
        //     }
        //     let currentUserId = +container.id
        //     if (currentUserId !== hostID) {
        //         const kick__btn = document.createElement('button')
        //         kick__btn.classList.add('user__name--kick', `kick-${currentUserId}`)
        //         kick__btn.innerHTML = `<i id=${currentUserId} class="fa-solid fa-x"></i>`
        //         kick__btn.id = currentUserId
        //         container.appendChild(kick__btn)
        //     }
        // })
        // user__listContainer.forEach(node => {

        // });

        // if (userId !== hostID) {
        //     kick__btn.addEventListener('click', (event) => {
        //         event.preventDefault();
        //         sfx.negative.play()
        //         socket.emit('kick-user', clients[client].userId)
        //     })
        //     const kick__btns = document.querySelectorAll('.user__name--kick')
        //     kick__btns.forEach(button => {
        //         button.remove()
        //     });
        // }


    }
})

// REDIRECT
socket.on('redirect-to-lobbylist', () => {
    // redirect to new URL
    socket.disconnect();
    window.location = "/lobby"
});

// REDIRECT
socket.on('redirect-to-mainmenu', () => {
    // redirect to new URL
    socket.disconnect();
    window.location = "/mainmenu"
});