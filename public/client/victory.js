socket.on('create-victory', (victoryObject) => {
    ///////////////////////////////////////////////////
    ///////// This is what the victoryObject looks like
    // victoryObject = {
    //     winner: {
    //         userId: 99,
    //         username: 'Bob',
    //         avatar: 'unicorn',
    //         points: 30
    //     },
    //     leaderboard: [{
    //         userId: 99,
    //         username: 'Bob',
    //         avatar: 'unicorn',
    //         points: 30
    //     }, {}]
    // }
    ////////////////////////////////////////////////////

    music.victory.loop(true).play()
    const section__victory = document.querySelector('.section-victory')

    const victory__container = document.createElement('div')
    victory__container.classList.add('victory__container')

    const victory__header = document.createElement('h1')
    victory__header.innerText = `Victory Screen`

    const victory__winner = document.createElement('h1')
    victory__winner.innerText = `The Winner is: ${victoryObject.winner.username} with ${victoryObject.winner.points} points`
    victory__winner.classList.add(`user${1}`)

    const leaderboard__header = document.createElement('p')
    leaderboard__header.innerText = `............ THE LEADERBOARD .............`

    const leaderboard = document.createElement('div')
    for (let i = 0; i < victoryObject.leaderboard.length; i++) {
        const entry = document.createElement('p')
        entry.innerText = `#${i + 1}  --  ${victoryObject.leaderboard[i].username} with ${victoryObject.leaderboard[i].points} points`
        entry.classList.add(`user${i + 1}`)
        leaderboard.appendChild(entry)
    }
    

    const returnLobby__btn = document.createElement('button')
    returnLobby__btn.classList.add('btn', 'btn-success')
    returnLobby__btn.innerText = 'Return to Lobby'

    victory__container.appendChild(victory__header)
    victory__container.appendChild(victory__winner)
    victory__container.appendChild(leaderboard__header)
    victory__container.appendChild(leaderboard)
    victory__container.appendChild(returnLobby__btn)
   
    section__victory.appendChild(victory__container)

    returnLobby__btn.addEventListener('click', (event) => {
        event.preventDefault();
        socket.emit('return-to-lobby')
    })

    section__victory.classList.remove('hide')
})

socket.on('remove-victory', () => {
    music.victory.fade(1, 0, 3000).stop()
    const section__victory = document.querySelector('.section-victory')
    const victory__container = document.querySelector('.victory__container')
    victory__container.remove()
    section__victory.classList.add('hide')
})