


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

    // const winner = victoryObject.winner

    // const section__victory = document.querySelector('.section-victory')
    // const carousel__crush = document.querySelector('.carousel')
    // const carousel__slideContainer = document.querySelector('.carousel__slideContainer')

    // const victory__page = document.createElement('div')
    // const victory__transition = document.createElement('div')
    // const victory__transition_text = document.createElement('div')
    // const victory__leaderboard = document.createElement('div')

    // const crush__dialogueContainer = document.createElement('div')
    // const crush__dialogue = document.createElement('div')

    // victory__page.classList.add('victory__screen')
    // victory__transition.classList.add('victory__transition')
    // victory__transition_text.classList.add('victory__transition-text')
    // victory__leaderboard.classList.add('victory__leaderboard')

    // carousel__crush.classList.add('hide', 'animation-fadingIn')
    // carousel__crush.classList.remove('carousel--moveBack', 'carousel--moveRight')
    // crush__dialogueContainer.classList.add('crush__dialogueContainer', 'crush__dialogueContainer--victory', 'opacity-0')
    // crush__dialogue.classList.add('crush__dialogue')

    // let counter = 0
    // const victory__script = [
    //     'Now that the game is over...',
    //     'I shall announce the winner of this war...',
    //     'They are...'
    // ]

    
    // setInterval( function(){
    //     victory__transition_text.classList.add('opacity-0')
    //     setTimeout(() => {
    //         victory__transition_text.innerHTML = `${victory__script[counter]}`
    //         victory__transition_text.classList.remove('opacity-0')
    //         counter++
    //         if(counter >= victory__script.length){
    //             victory__transition.classList.add('victory__transition--fadeOut')
    //             victory__transition.classList.remove()
    //             crush__dialogue.innerText = `${winner.username}! With a score of ${winner.points}! You have stolen my heart! Take me with you to space!`
    //             carousel__crush.classList.remove('hide')
    //             victory__transition.classList.add('hide')
    //             crush__dialogueContainer.classList.remove('hide')
    //             clearInterval()
    //         }
    //         }, 500)
    //     }
    // , 2500)


    // crush__dialogueContainer.appendChild(crush__dialogue)
    // carousel__slideContainer.appendChild(crush__dialogueContainer)

    // victory__page.appendChild(victory__transition)
    // victory__transition.appendChild(victory__transition_text)
    // victory__page.appendChild(carousel__crush)

    // section__victory.appendChild(victory__page)


    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


    const section__victory = document.querySelector('.section-victory')

    const victory__container = document.createElement('div')
    victory__container.classList.add('victory__container')

    const winner__container = document.createElement('div')
    winner__container.classList.add('winner__container')

    const victory__header = document.createElement('h1')
    victory__header.innerText = `Victory Screen`
    victory__header.classList.add('victory__header')

    const victory__winner = document.createElement('h2')
    victory__winner.innerText = `The Winner is: ${victoryObject.winner.username} with ${victoryObject.winner.points} points`
    victory__winner.classList.add(`winner__header`)

    const leaderboard__container = document.createElement('div')
    leaderboard__container.classList.add('leaderboard__container')

    const leaderboard__header = document.createElement('h1')
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

    winner__container.appendChild(victory__header)
    winner__container.appendChild(victory__winner)
    victory__container.appendChild(winner__container)
    leaderboard__container.appendChild(leaderboard__header)
    leaderboard__container.appendChild(leaderboard)
    victory__container.appendChild(leaderboard__container)
    victory__container.appendChild(returnLobby__btn)
   
    section__victory.appendChild(victory__container)

    returnLobby__btn.addEventListener('click', (event) => {
        event.preventDefault();
        sfx.join.play()
        socket.emit('return-to-lobby')
    })

    section__victory.classList.remove('hide')
})

socket.on('remove-victory', () => {
    music.victory.fade(1, 0, 3000).stop()
    const section__victory = document.querySelector('.section-victory')
    // ! const victory__ = document.querySelector('.victory__')
    const section__sidebar = document.querySelector('.section-sidebar')
    const carousel__crush = document.querySelector('.carousel')
    
    // below - temporary for demo
    const victory__container = document.querySelector('.victory__container')
    victory__container.remove()


    carousel__crush.remove()
    //! victory__.remove()
    section__sidebar.remove()
    section__victory.classList.add('hide')
})