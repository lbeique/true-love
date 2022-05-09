socket.on('create-victory', (winner) => {
    console.log('create victory', winner)
    const section__victory = document.querySelector('.section-victory')

    const victory__container = document.createElement('div')
    victory__container.classList.add('victory__container')

    const victory__header = document.createElement('h1')
    victory__header.innerText = `Victory Screen`

    const victory__winner = document.createElement('p')
    victory__winner.innerText = `The Winner is: ${winner.name} with ${winner.points} pts`

    const returnLobby__btn = document.createElement('button')
    returnLobby__btn.classList.add('btn', 'btn-success')
    returnLobby__btn.innerText = 'Return to Lobby'

    victory__container.appendChild(victory__header)
    victory__container.appendChild(victory__winner)
    victory__container.appendChild(returnLobby__btn)
   
    section__victory.appendChild(victory__container)

    returnLobby__btn.addEventListener('click', (event) => {
        event.preventDefault();
        socket.emit('return-to-lobby')
    })

    section__victory.classList.remove('hide')
})

socket.on('remove-victory', () => {
    const section__victory = document.querySelector('.section-victory')
    const victory__container = document.querySelector('.victory__container')
    victory__container.remove()
    section__victory.classList.add('hide')
})