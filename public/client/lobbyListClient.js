const socket = io.connect()

const lobby_listContainer = document.querySelector('.lobby-list__list')
const refreshBtn = document.querySelector('.lobby-list__refreshBtn')
const section__main = document.querySelector('.section-lobbies')



lobbyListMusic.lobby2.volume(0.5).seek(54).loop(true).play()



refreshBtn.addEventListener('click', (event) => {
    event.preventDefault()
    sfx.positive.play()
    socket.emit('lobby-refresh')
})

socket.emit('lobby-refresh')

// CREATES LOBBY LIST
socket.on('lobby-list', (lobbyRooms) => {
    lobby_listContainer.innerHTML = '' // ! MUST HAVE

    if (!Object.keys(lobbyRooms).length) {
        return
    }

    for (const lobby in lobbyRooms) {
        console.log("LOBBY", lobbyRooms[lobby])

        const clientsInLobby = Object.keys(lobbyRooms[lobby].clients).length;

        const lobby_room = document.createElement('div')
        const lobbyForm = document.createElement('form')
        lobbyForm.classList.add('lobby-list__form')
        lobbyForm.action = '/lobby/joinLobby'
        lobbyForm.method = 'POST'

        const lobbyButton = document.createElement('button')
        lobbyButton.classList.add('btn', 'lobby-list__roomBtn', 'btn--darkPurple')
        lobbyButton.type = 'submit'
        lobbyButton.name = "room_code"
        lobbyButton.value = lobbyRooms[lobby].room_code
        lobbyButton.innerHTML = `
            <span class="lobby-list__roomBtn--name">
                ${lobbyRooms[lobby].room_name}
            </span> 
            <span class="lobby-list__roomBtn--info"> 
                ${clientsInLobby} 
               <i class="fa-solid fa-user-large"></i>
            </span>`

        lobbyForm.appendChild(lobbyButton)
        lobby_room.appendChild(lobbyForm)


        lobby_room.classList.add('lobby-list__room')
        lobby_listContainer.appendChild(lobby_room) // lobbyList
    }
})
