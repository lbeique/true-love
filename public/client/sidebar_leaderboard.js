let currentPhase

// SIDEBAR TOGGLES

function sidebarToggle(){

    // console.log("NORMAL TOGGLE")

    const section__sidebar = document.querySelector('.section-sidebar')
    const sidebar__container = document.querySelector('.sidebar__container')
    const sidebar__players = document.querySelector('.sidebar__players')

    document.querySelector('.sidebar__header-text').classList.toggle('hide')

    section__sidebar.classList.toggle('section-sidebar--close')
    section__sidebar.classList.toggle('section-sidebar--open')
    sidebar__players.classList.toggle('sidebar__players--close')
    sidebar__players.classList.toggle('sidebar__players--open')
    sidebar__container.classList.toggle('sidebar__container--close')
    sidebar__container.classList.toggle('sidebar__container--open')

    document.querySelectorAll('.player__info').forEach((player) => {
        player.classList.toggle('hide')
    })

    document.querySelectorAll('.player__avatarContainer').forEach((avatar) => {
        avatar.classList.toggle('player__avatarContainer--close')
        avatar.classList.toggle('player__avatarContainer--open')
    })

    document.querySelector('.player__youContainer').classList.toggle('player__youContainer--close')
    document.querySelector('.player__youContainer').classList.toggle('player__youContainer--open')

    document.querySelector('.player__youText').classList.toggle('hide')

}

function toggleLounge(){

    // console.log("TOGGLE LOUNGE")

    document.querySelector('.section-sidebar').classList.toggle('section-sidebar--open-votingLounge')

    document.querySelector('.carousel__slide').classList.toggle('carousel__slide--move')
    document.querySelector('.carousel__slide').classList.toggle('carousel__slide--original')
    document.querySelector('.carousel__slideText').classList.toggle('carousel__slideText--original')
    document.querySelector('.carousel__slideText').classList.toggle('carousel__slideText--move')

    document.querySelector('.crush__dialogueContainer').classList.add('crush__dialogueContainer--moveBack')
    document.querySelector('.crush__dialogueContainer').classList.add('crush__dialogueContainer--moveRight')

    document.querySelectorAll('.player__position').forEach((node) => node.classList.toggle('hide'))

    const result = document.querySelector('.carousel').classList.toggle('carousel--moveRight')
    if(result){
        document.querySelector('.carousel').classList.remove('carousel--moveBack')
    } else{
        document.querySelector('.carousel').classList.add('carousel--moveBack')
    }

}

function toggleTrivia(){

    // console.log("TOGGLE TRIVIA")

    const section__sidebar = document.querySelector('.section-sidebar')
    const sidebar__overlay = document.querySelector('.sidebar__overlay')


    section__sidebar.classList.toggle('section-sidebar--open-trivia')

    document.querySelectorAll('.player__position').forEach((node) => node.classList.toggle('hide'))

    sidebar__overlay.classList.toggle('hide')

}






socket.on('receive room_clients', (room) => {

    // console.log("ROOM", room)

    const section__voting = document.querySelector('.section-crushes')
    const voting__carousel = document.querySelector('.carousel')
    const carousel__leftBtn = document.querySelector('.carousel__btn--left')
    const carousel__rightBtn = document.querySelector('.carousel__btn--right')
    const carousel__slide = document.querySelector('.carousel__slide')
    const vote__btn = document.querySelector('.carousel__voteButton')
    const carousel__text = document.querySelector('.carousel__slideText')

    const section__sidebar = document.createElement('section')
    const sidebar = document.createElement('div')
    const sidebar__container = document.createElement('div')
    const sidebar__header = document.createElement('div')
    const sidebar__players = document.createElement('div')

    section__sidebar.classList.add('section-sidebar','section-sidebar--close')
    sidebar.classList.add('sidebar')
    sidebar__container.classList.add('sidebar__container', 'sidebar__container--close')
    sidebar__header.classList.add('sidebar__header')
    sidebar__players.classList.add('sidebar__players', 'sidebar__players--close')

    sidebar__header.innerHTML = '<i class="fa-solid fa-flag-checkered"></i> <span class="sidebar__header-text hide"> LEADERBOARD<span>'

    
    currentPhase = room.gameState.phase


    sidebar__container.addEventListener('click', function sidebar(event){
        event.preventDefault()
        switch(currentPhase){

            case 'voting':
                sidebarToggle()
                section__sidebar.classList.toggle('section-sidebar--open-votingLounge')

                carousel__leftBtn.classList.toggle('carousel__btn--left')
                carousel__leftBtn.classList.toggle('carousel__btn--left-move')
                carousel__rightBtn.classList.toggle('carousel__btn--right')
                carousel__rightBtn.classList.toggle('carousel__btn--right-move')
                carousel__slide.classList.toggle('carousel__slide--move')
                carousel__slide.classList.toggle('carousel__slide--original')
                carousel__text.classList.toggle('carousel__slideText--original')
                carousel__text.classList.toggle('carousel__slideText--move')
                vote__btn.classList.toggle('carousel__voteButton--original')
                vote__btn.classList.toggle('carousel__voteButton--move')

                document.querySelectorAll('.player__avatarContainer').forEach((node) => node.classList.toggle('margin-left-2'))

                const result = voting__carousel.classList.toggle('carousel--moveRight')
                if(result){
                    voting__carousel.classList.remove('carousel--moveBack')
                } else{
                    voting__carousel.classList.add('carousel--moveBack')
                }
                break;
            
            case 'trivia':
                sidebarToggle()
                toggleTrivia()
                break;
            
            case 'lounge':
                sidebarToggle()
                toggleLounge()
                if(document.querySelector('.lounge__timerContainer').classList.contains('lounge__timerContainer--girl')){
                    document.querySelector('.lounge__timerContainer').classList.toggle('lounge__timerContainer--girl--close')
                    document.querySelector('.lounge__timerContainer').classList.toggle('lounge__timerContainer--girl--open')
                }
                break;
            case 'victory':
                event.target.removeEventListener('click', this.sidebar)
                break;
                
        }
    
    })

    const clients = room.clients

    for(let client in clients){
        sidebar__players.appendChild(displayUsers(clients[client]))
    }

    sidebar__container.appendChild(sidebar__header)
    sidebar__container.appendChild(sidebar__players)
    sidebar.appendChild(sidebar__container)
    section__sidebar.appendChild(sidebar)
    section__voting.prepend(section__sidebar)

})




function displayUsers(player){    // player DOM
    // console.log('player', player)

    const player__container = document.createElement('div')
    const player__avatarContainer = document.createElement('div')
    const player__avatar = document.createElement('img')
    const player__info = document.createElement('div')

    player__container.classList.add(`player-${player.userId}`, 'player__container')
    player__avatarContainer.classList.add('player__avatarContainer', 'player__avatarContainer--close')
    player__avatar.classList.add('player__avatar')
    player__info.classList.add('player__info', 'hide')

    player__avatar.src = `assets/user-avatars/avatar_${player.avatar}.png`
    player__info.innerHTML = `
        <span class='info__name'> ${player.username} </span>
        <span class='info__note'> thinking... </span>
    `

    player__avatarContainer.appendChild(player__avatar)
    player__container.appendChild(player__avatarContainer)
    player__container.appendChild(player__info)

    if(player.userId === +USER_ID){
        
        const player__YOUcontainer = document.createElement('div')
        const player__YOU = document.createElement('div')
        player__YOUcontainer.classList.add('player__youContainer', 'player__youContainer--close')
        player__YOU.classList.add('player__you')

        player__YOU.innerHTML = '<span class="player__youText"> YOU </span>'
        
        player__YOUcontainer.appendChild(player__YOU)
        player__container.appendChild(player__YOUcontainer)

    }

    return player__container

}

socket.on('client_voted', (clientID) => {

    if(+USER_ID === clientID){

        const carousel__voteBtn = document.querySelector('.carousel__voteButton')
        const carousel__btn = document.querySelectorAll('.carousel__btn')
       
        carousel__voteBtn.remove()
        carousel__btn.forEach((btn) => btn.remove())
 
     }
    
    const player__votedAvatar = document.querySelector(`.player-${clientID}  .player__avatarContainer`) 
    const player__votedName = document.querySelector(`.player-${clientID} .info__name`)
    const player__votedText = document.querySelector(`.player-${clientID} .info__note`)

    player__votedAvatar.classList.add('player__avatarContainer--green')
    player__votedName.classList.add('info__name--green')
    player__votedText.classList.add('info__note--green')
    player__votedText.innerText = 'VOTED!'

})

function returnPosition(positionNum){
    
    const checkRemainder = positionNum % 10

    switch(checkRemainder){
        case 1:
            return `${positionNum}st`
        case 2:
            return`${positionNum}nd`
        case 3:
            return`${positionNum}rd`
        default:
            return`${positionNum}th`
    }

}

socket.on('setup-sidebar-trivia', (sidebarData) => { // ! Everything that was '--open' must be '--close'

    currentPhase = sidebarData.phase
    const leaderboard = sidebarData.leaderboard

    const section__trivia = document.querySelector('.section-trivia')
    const section__sidebar = document.querySelector('.section-sidebar')
    const sidebar__overlay = document.createElement('div')

    sidebar__overlay.classList.add('sidebar__overlay', 'hide')

    if(section__sidebar.classList.contains('section-sidebar--open')){
        sidebarToggle()
        section__sidebar.classList.remove('section-sidebar--open-votingLounge')
    }

    document.querySelectorAll('.player__avatarContainer').forEach((node) => node.classList.remove('margin-left-2'))
    
    let counter = 1;
    for(let i = 0; i < leaderboard.length; i++){ 

        const player = leaderboard[i]

        const player__container = document.querySelector(`.player-${player.userId}`)
        const info__note = document.querySelector(`.player-${player.userId} .info__note`)
        const player__youText = document.querySelector('.player__youText')

        const player__position = document.createElement('span')
        player__position.classList.add('player__position', 'hide')

        position = returnPosition(counter)

        player__position.innerHTML = `${position}`
        info__note.innerHTML = `${player.points} pts`
      
        if(+USER_ID === player.userId){
            player__youText.innerHTML = `${position}`
        }

        player__container.prepend(player__position)

        counter++

    }


    sidebar__overlay.addEventListener('click', (event) => {
        event.preventDefault()
        sidebarToggle()
        toggleTrivia()
    })

    section__trivia.appendChild(sidebar__overlay)
    section__trivia.appendChild(section__sidebar)
    
})


socket.on('update-leaderboard', (leaderboard) => {
    ///////////////////////////////////////////////////
    // This is what the leaderboard looks like:
    // leaderboard: [{
    //     userId: 99,
    //     username: 'Bob',
    //     avatar: 'unicorn',
    //     points: 30
    // }, {}]
    ////////////////////////////////////////////////////

    const sidebar__players = document.querySelector('.sidebar__players')

    let counter = 1;
    for(let i = 0; i < leaderboard.length; i++){ 
        const player = leaderboard[i]

        const player__container =  document.querySelector(`.player-${player.userId}`)
        const info__note = document.querySelector(`.player-${player.userId} .info__note`)
        const player__position = document.querySelector(`.player-${player.userId} .player__position`)

        const prevPosition = player__position.textContent.substring(0, 1)
        const currentPosition = counter

        info__note.innerHTML = `${player.points} pts`
        let position = returnPosition(currentPosition)
    
        player__position.innerHTML = `${position}`

        if(+USER_ID === player.userId){
            const player__YOUtext = document.querySelector(`.player-${player.userId} .player__youText`)
            player__YOUtext.innerHTML = `${position}`
        }

        if(currentPosition < +prevPosition){
            player__container.classList.add('player__container--moveUp')
            setTimeout(() => {
                player__container.classList.remove('player__container--moveUp')
            }, 1000)


        } else if(currentPosition > +prevPosition){
            player__container.classList.add('player__container--moveDown')
            setTimeout(() => {
                player__container.classList.remove('player__container--moveDown')
            }, 1000)

        }

        sidebar__players.appendChild(player__container)

        counter++
    }
    
    
})


// LOUNGE

socket.on('setup-sidebar-lounge', (phase) => {

    currentPhase = phase

    // console.log('SETUP SIDEBAR LOUNGE')

    const section__sidebar = document.querySelector('.section-sidebar')
    const section__lounge = document.querySelector('.section-lounge')
   
    if(section__sidebar.classList.contains('section-sidebar--close')){
        sidebarToggle()
        document.querySelector('.carousel__slide').classList.remove('carousel__slide--original')

    } else if(section__sidebar.classList.contains('section-sidebar--open-trivia')){
        section__sidebar.classList.remove('section-sidebar--open-trivia')
        document.querySelectorAll('.player__position').forEach((node) => node.classList.add('hide'))
    } 

    if(document.querySelector('.lounge__timerContainer').classList.contains('lounge__timerContainer--girl')){
        document.querySelector('.lounge__timerContainer').classList.add('lounge__timerContainer--girl--open')
    }

  
    document.querySelector('.crush__dialogueContainer').classList.add('crush__dialogueContainer--moveRight')
    document.querySelector('.carousel__slideText').classList.add('carousel__slideText--move')
    document.querySelector('.carousel__slide').classList.add('carousel__slide--move')
    document.querySelector('.section-sidebar').classList.toggle('section-sidebar--open-votingLounge')
    document.querySelectorAll('.player__position').forEach((node) => node.classList.toggle('hide'))
    document.querySelector('.carousel').classList.add('carousel--moveRight')
    

    section__lounge.prepend(section__sidebar)

})

socket.on('setup-sidebar-victory', (victoryObject) => {
    /* 
    dialogue: Array(0)
        length: 0
        [[Prototype]]: Array(0)
        leaderboard: Array(1)
        0:
            avatar: "sunglasses"
            easyPoints: 4
            hardPoints: 1
            mediumPoints: 4
            points: 9
            userId: 24
            username: "chicken"
            [[Prototype]]: Object
            length: 1
        [[Prototype]]: Array(0)
    winner:
        avatar: "sunglasses"
        easyPoints: 4
        hardPoints: 1
        mediumPoints: 4
        points: 9
        userId: 24
        username: "chicken"
    
    */

    currentPhase = victoryObject.phase
    
    const leaderboard = victoryObject.leaderboard

    const section__sidebar = document.querySelector('.section-sidebar')
    const player__positions = document.querySelectorAll('.player__position')
    const player__avatarContainers = document.querySelectorAll('.player__avatarContainer')
    

    if(section__sidebar.classList.contains('section-sidebar--close')){
        sidebarToggle()
        section__sidebar.classList.remove('section-sidebar--open-trivia')
        player__positions.forEach((position) => {
            position.classList.remove('hide')
            position.classList.add('margin-left-2')
        })
        
    }

    player__avatarContainers.forEach((avatar) => avatar.classList.add('player__avatarContainer--open-victory'))
    section__sidebar.classList.add('section-sidebar--open-victory')

    let difficulty = ['easy', 'medium', 'hard']
    let counter = 0
    for(let player of leaderboard){

        const player__info = document.querySelector(`.player-${player.userId} .player__info`)
        const info__note = document.querySelector(`.player-${player.userId} .info__note`)
        const player__triviaPts_container = document.createElement('div')
        
        player__triviaPts_container.classList.add('player__subCategory-container')

        for(let i = 1; i <= 3; i++){
            const player__categoryPoints = document.createElement('div')
            const player__categoryPoints_left = document.createElement('div')
            const player__categoryPoints_right = document.createElement('div')

            player__categoryPoints.classList.add('info__category-details')
            player__categoryPoints_left.classList.add('info__category-details--left')
            player__categoryPoints_right.classList.add('info__category-details--right')

            player__categoryPoints_left.innerText = `Trivia ${i}:`
            player__categoryPoints_right.innerText = `${player[difficulty[counter]]} pts`

            player__categoryPoints.append(player__categoryPoints_left, player__categoryPoints_right)
            player__triviaPts_container.appendChild(player__categoryPoints)
            
        }

        info__note.innerText = `Total: ${player.points} pts`
        
        player__info.insertBefore(player__triviaPts_container, info__note)

    }

})