

socket.on('receive room_clients', (room) => {

    console.log("ROOM", room)

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

    sidebar__container.addEventListener('click', (event) => {
        event.preventDefault()
        sidebarToggle()

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

        const result = voting__carousel.classList.toggle('carousel--moveRight')
        if(result){
            voting__carousel.classList.remove('carousel--moveBack')
        } else{
            voting__carousel.classList.add('carousel--moveBack')
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






function sidebarToggle(){

    const section__sidebar = document.querySelector('.section-sidebar')
    const sidebar__container = document.querySelector('.sidebar__container')
    const sidebar__players = document.querySelector('.sidebar__players')

    document.querySelector('.sidebar__header-text').classList.toggle('hide')

    section__sidebar.classList.toggle('section-sidebar--close')
    section__sidebar.classList.toggle('section-sidebar--open')
    section__sidebar.classList.toggle('section-sidebar--open-votingLounge')
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






function displayUsers(player){    // player DOM
    console.log('player', player)

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

    // leaderboard stuff goes here?

})


// socket.on('setup-sidebar-trivia', () => { // ! Everything that was '--open' must be '--close'

//     const section__trivia = document.querySelector('.section-trivia')
//     const section__sidebar = document.querySelector('.section-sidebar')

//     const sidebar__overlay = document.createElement('div')
//     sidebar__overlay.classList.add('sidebar__overlay', 'hide')

//     if(section__sidebar.classList.contains('section-sidebar--open')){
//         console.log("RUNNN")
//         sidebarToggle()
//     }

//     section__trivia.appendChild(sidebar__overlay)
//     section__trivia.appendChild(section__sidebar)
    
// })

// socket.on('send-updated-leaderboard', (leaderboard) => {
//     /* 
//     Data being sent:
//      Array(2)
//         0:
//             avatar: "sunglasses"
//             points: 10
//             userId: "8345"
//             username: "jholman"
//             [[Prototype]]: Object
//         1:
//             avatar: "sunglasses"
//             points: 5
//             userId: "2529"
//             username: "mad max"
//             [[Prototype]]: Object
//             length: 2
//     */

//     const section__sidebar = document.querySelector('.section-sidebar')
//     const sidebar__container = document.querySelector('.sidebar__container')
//     const sidebar__overlay = document.querySelector('.sidebar__overlay')

//     // const player__containers = document.querySelectorAll('.player__container')

//     const updatedLeaderboard = []
    
//     for(let i = 0; i < leaderboard.length; i++){

        
//         const player = leaderboard[i]

//         const player__container =  document.querySelector(`.player-${player.userId}`)
//         const info__note = document.querySelector(`.player-${player.userId} .info__note`)

//         const player__position = document.createElement('span')

//         player__position.classList.add('player__position', 'hide')

//         info__note.innerHTML = `${player.points} pts`
//         const checkRemainder = (i + 1) % 10
//         let positionResult = ``

//         switch(checkRemainder){
//             case 1:
//                 positionResult = `${++i}st`
//                 break;
//             case 2:
//                 positionResult = `${++i}nd`
//                 break;
//             case 3:
//                 positionResult = `${++i}rd`
//                 break;
//             default:
//                 positionResult = `${++i}th`
//                 break;
//         }
    
//         player__position.innerHTML = `${positionResult}`

//             const player__YOUtext = document.querySelector(`.player-${player.userId} .player__youText`)
//             player__YOUtext.innerHTML = `${positionResult}` 

        

//         player__container.prepend(player__position)
    
//         console.log("PLAYER CONTAINER", player__container)
//         updatedLeaderboard.push(player__container)

//     }
    
//     console.log("updated Leaderboard", updatedLeaderboard)

//     sidebar__container.addEventListener('click', (event) => {
//         event.preventDefault()
//         sidebarToggle()
//         section__sidebar.classList.toggle('section-sidebar--close')
//         section__sidebar.classList.toggle('section-sidebar--open-trivia')

//         document.querySelectorAll('.player__position').forEach((node) => node.classList.toggle('hide'))

//         sidebar__overlay.classList.toggle('hide')

//     })

//     // sidebar__players.innerHTML = ''
//     // updatedLeaderboard.map((player) => {
//     //     sidebar__players.appendChild(player)
//     // })

// })

