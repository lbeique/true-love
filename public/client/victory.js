function generateHearts(){
    
    setInterval(function(){
        const heart = document.createElement('div');
        const scale = Math.random() * 200;
        heart.innerHTML = `<i class="fa-solid fa-heart victory__heart"></i>`
        heart.style.animationDuration = (Math.random() * 3) + 2 + 's'
        heart.style.transform = `scale(${scale}%, ${scale}%) translateX(${Math.random() * 100}%)`
        document.querySelector('.victory__screen').appendChild(heart)
    }, 100)

    setTimeout(() => {
        setInterval(function name(params){
            let heartArr = document.querySelectorAll('.heart')
            if(heartArr.length > 200){
                heartArr[0].remove()
            }
        }, 50)
    }, 1000)
}

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

    const winner = victoryObject.winner

    console.log('victory Object', victoryObject)

    const section__victory = document.querySelector('.section-victory')
    const sidebar__players = document.querySelector('.sidebar__players')
    const carousel__crush = document.querySelector('.carousel')
    const carousel__slideContainer = document.querySelector('.carousel__slideContainer')
    const section__sidebar = document.querySelector(".section-sidebar")

    const victory__page = document.createElement('div')
    const victory__transition = document.createElement('div')
    const victory__transition_text = document.createElement('div')
    const victory__leaderboard = document.createElement('div')

    const crush__dialogueContainer = document.createElement('div')
    const crush__dialogue = document.createElement('div')

    victory__page.classList.add('victory__screen')
    victory__transition.classList.add('victory__transition')
    victory__transition_text.classList.add('victory__transition-text')
    victory__leaderboard.classList.add('victory__leaderboard')

    carousel__crush.classList.add('hide', 'animation-fadingIn')
    carousel__crush.classList.remove('carousel--moveBack', 'carousel--moveRight')
    crush__dialogueContainer.classList.add('crush__dialogueContainer', 'crush__dialogueContainer--victory', 'hide')
    crush__dialogue.classList.add('crush__dialogue')

    let counter = 0
    const victory__script = [
        'Now that the game is over...',
        'I shall announce the winner of this war...',
        'They are...'
    ]

    carousel__crush.style.zIndex = '40';
    
    setInterval(function(){
        victory__transition_text.classList.add('opacity-0')
        setTimeout(() => {
            victory__transition_text.innerHTML = `${victory__script[counter]}`
            victory__transition_text.classList.remove('opacity-0')
            counter++
            if(counter >= victory__script.length){
                document.querySelector(".carousel__slideText").classList.add('hide')
                victory__transition.classList.add('victory__transition--fadeOut')
                victory__transition.classList.remove()
                crush__dialogue.innerText = `${winner.username}! You have stolen my heart! Take me with you to space!`
                carousel__crush.classList.remove('hide')
                crush__dialogueContainer.classList.remove('hide')
                victory__transition.remove()
                generateHearts()
                clearInterval()
            }
            }, 500)
        }
    , 2000)

    setTimeout(() => {

        const victory__returnLobbyBtn = document.createElement('btn')
        victory__returnLobbyBtn.classList.add('btn', 'btn--green', 'victory__return-btn')
        victory__returnLobbyBtn.innerText = 'Return to Lobby'

        victory__returnLobbyBtn.addEventListener('click', (event) => {
            event.preventDefault();
            sfx.join.play()
            socket.emit('return-to-lobby')
        })

        victory__page.prepend(section__sidebar)
        sidebar__players.appendChild(victory__returnLobbyBtn)

    }, 15000)


    crush__dialogueContainer.appendChild(crush__dialogue)
    carousel__slideContainer.appendChild(crush__dialogueContainer)

    victory__page.appendChild(victory__transition)
    victory__transition.appendChild(victory__transition_text)
    victory__page.appendChild(carousel__crush)

    section__victory.appendChild(victory__page)

    section__victory.classList.remove('hide')
})

socket.on('remove-victory', () => {
    music.victory.fade(1, 0, 3000).stop()
    const section__victory = document.querySelector('.section-victory')
    const victory__screen = document.querySelector('.victory__screen')
    const section__sidebar = document.querySelector('.section-sidebar')
    const carousel__crush = document.querySelector('.carousel')
    
    victory__screen.remove()
    carousel__crush.remove()
    section__sidebar.remove()
    section__victory.classList.add('hide')
})