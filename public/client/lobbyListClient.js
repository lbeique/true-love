const socket = io.connect()

const lobby_list = document.querySelector('.lobby__list')
const lobbyContainer = document.createElement('div')
const refreshBtn = document.querySelector('#refresh')
const section__main = document.querySelector('.section-main--bg1')

refreshBtn.addEventListener('click', (event) => {
    event.preventDefault()
    socket.emit('lobby-refresh')
})

socket.emit('lobby-refresh')

// CREATES LOBBY LIST
socket.on('lobby-list', (lobbyRooms) => {
    lobbyContainer.childNodes.forEach(node => {
        node.remove()
    })
    if (!Object.keys(lobbyRooms).length) {
        return
    }
    for (const lobby in lobbyRooms) {
        const lobbyForm = document.createElement('form')
        lobbyForm.action = '/lobby/joinLobby'
        lobbyForm.method = 'POST'

        const lobbyButton = document.createElement('button')
        lobbyButton.classList.add('btn', 'btn-success')
        lobbyButton.type = 'submit'
        lobbyButton.name = "room_code"
        lobbyButton.value = lobbyRooms[lobby].room_code
        lobbyButton.innerText = lobbyRooms[lobby].room_name

        lobbyForm.appendChild(lobbyButton)
        lobbyContainer.appendChild(lobbyForm)
        section__main.appendChild(lobbyContainer)
    }
    lobbyContainer.classList.add('lobby__container')
    lobby_list.appendChild(lobbyContainer)
})