// we can put the .global_standings on the leaderboard button or icon

function returnPosition(positionNum){
    
    const checkRemainder = positionNum % 10

    console.log("CHECK REMAINDER", checkRemainder)

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

function global_leaderboard_setup(globalLeaderboard, current__client){

    const section__menu = document.querySelector(".section-menu")
    const section__leaderboard = document.querySelector(".section-leaderboard")

    if(document.querySelector('.sidebar')){
        document.querySelector('.sidebar').remove()
    }

    const leaderboard = document.createElement('div')
    const leaderboard__container = document.createElement('div')
    const leaderboard__header = document.createElement('div')
    const leaderboard__players = document.createElement('div')
    const leaderboard__back_btn = document.createElement('a')
    const leaderboard__categoriesContainer = document.createElement('div')

    leaderboard__back_btn.classList.add('btn', 'btn__back', 'btn--darkPurple', 'leaderboard__backBtn')
    section__leaderboard.classList.add('section-sidebar','section-sidebar--open', 'section-sidebar--open-victory')
    leaderboard.classList.add('sidebar')
    leaderboard__container.classList.add('sidebar__container', 'sidebar__container--open', 'sidebar__container--open-leaderboard')
    leaderboard__header.classList.add('sidebar__header')
    leaderboard__players.classList.add('sidebar__players', 'sidebar__players--open')
    leaderboard__categoriesContainer.classList.add('leaderboard__categories-container')

    for(let i= 0; i < 3; i++){
        
        const leaderboard__category_btn = document.createElement('div')
        leaderboard__category_btn.classList.add('btn','leaderboard__category-btn')

        if(i === 0){
            leaderboard__category_btn.innerText = `Global Top 50`
            leaderboard__category_btn.addEventListener('click', (event) => {
                event.preventDefault()
                console.log("GLOBAL TOP 50")
                request_global_leaderboard()
            })
        } else if (i === 1){
            leaderboard__category_btn.innerText = `Global Matches`
            leaderboard__category_btn.addEventListener('click', (event) => {
                event.preventDefault()
                console.log("GLOBAL MATCHES")
                leaderboard.style.animation = 'none'
                request_global_matches()
            })
        } else if (i === 2){
            leaderboard__category_btn.innerText = `Personal Matches`
            leaderboard__category_btn.addEventListener('click', (event) => {
                event.preventDefault()
                console.log("PERSONAL MATCHES")
                leaderboard.style.animation = 'none'
                request_user_history()
            })
        }

        leaderboard__categoriesContainer.appendChild(leaderboard__category_btn)
    }

    leaderboard__back_btn.innerHTML = `<span>&#8618;</span>`
    leaderboard__header.innerHTML = '<i class="fa-solid fa-earth-americas"></i><span class="sidebar__header-text"> GLOBAL TOP 50 <span>'
    leaderboard.style.animation = 'fadingIn 1s ease backwards'

    leaderboard__container.append(leaderboard__header, leaderboard__categoriesContainer)
    leaderboard__container.appendChild(leaderboard__players)
    leaderboard.appendChild(leaderboard__container)
    section__leaderboard.append(leaderboard__back_btn, leaderboard)

    let positionNum = 1
    let counter = 0
    for(let i = 1; i <= 50; i++){
        let position = returnPosition(positionNum)
        let player = globalLeaderboard[counter]
        if(player){
            const player__container = displayPlayers(player, position, 'global')
            
            // player__container.style.animation = `slideFromBottom .1s ease ${counter - .8}s backwards`
            leaderboard__players.appendChild(player__container)
            positionNum++
            counter++
        } else{
            break
        }
    }

    counter = 0
    positionNum = 1
    for(let j = 0; j <= globalLeaderboard.length; j++){
        let player = globalLeaderboard[j]
        if(player.user_id === current__client.user_id){
            let position = returnPosition(positionNum)
            const client__container = displayPlayers(player, position, 'global') // dom container
            leaderboard__container.appendChild(set_up_client_container(client__container))
            break
        }
        positionNum++
        counter++
    }


    section__menu.classList.add('hide')
    section__leaderboard.classList.remove('hide')

}

function displayPlayers(player, position, location){


    /*
        playerObj
        0: {
            avatar_id: 4
            avatar_name: "sunglasses"
            total_points: "268"
            total_wins: 5
            user_id: 24
            user_name: "chicken"
            win_ratio: "0.7143"
        }

    */

    console.log('player', player)

    const player__container = document.createElement('div')
    const player__avatarContainer = document.createElement('div')
    const player__avatar = document.createElement('img')
    const player__info = document.createElement('div')
    const player__position = document.createElement('span')
    const info__name = document.createElement('span')
    const info__note = document.createElement('span')

    player__container.classList.add(`player-${player.user_id}`, 'player__container')
    player__avatarContainer.classList.add('player__avatarContainer', 'player__avatarContainer--open', 'player__avatarContainer--open-victory')
    player__avatar.classList.add('player__avatar')
    if(location === 'my_match'){
        player__info.classList.add('player__info-match')
    }
    player__info.classList.add('player__info')
    player__position.classList.add('player__position')
    info__name.classList.add('info__name')
    info__note.classList.add('info__note')

    player__avatar.src = `assets/user-avatars/avatar_${player.avatar_name}.png`
    info__name.innerHTML = `${player.user_name}`

    if(location === "global"){
        info__note.innerHTML = `Total Wins: ${player.total_wins}`
    } else if(location === 'my_match'){
        info__note.innerHTML = `${player.total_points} pts`
    }

    player__position.innerHTML = `${position}`

    player__avatarContainer.appendChild(player__avatar)
    player__container.appendChild(player__position)
    player__container.appendChild(player__avatarContainer)
    player__info.appendChild(info__name)
    player__container.appendChild(player__info)

    if(location === 'global'){

        const player__subCategory_container = document.createElement('div')
        player__subCategory_container.classList.add('player__subCategory-container', 'player__subCategory-container--leaderboard')

        for(let i = 1; i <= 2; i++){
            const player__subCategory = document.createElement('div')
            const player__subCategory_left = document.createElement('div')
            const player__subCategory_right = document.createElement('div')
    
            player__subCategory.classList.add('info__category-details')
            player__subCategory_left.classList.add('info__category-details--left')
            player__subCategory_right.classList.add('info__category-details--right')
    
            if(i === 1){
                player__subCategory_left.innerText = `Total pts:`
                player__subCategory_right.innerText = `${player.total_points} pts`    
            } else if(i === 2){
                player__subCategory_left.innerText = `Win Ratio:`
                player__subCategory_right.innerText = `${+player.win_ratio * 100}%` 
            }
    
            player__subCategory.append(player__subCategory_left, player__subCategory_right)
            player__subCategory_container.appendChild(player__subCategory)
    
        }

        player__info.appendChild(player__subCategory_container)

    }

    player__info.appendChild(info__note)

    if(player.user_id === +USER_ID){
        
        const player__YOUcontainer = document.createElement('div')
        const player__YOU = document.createElement('div')
        if(location === 'my_match'){
            player__YOUcontainer.classList.add('player__youContainer', 'player__youContainer--open', 'player__youContainer--open-match')
        } else if(location === 'global'){
            player__YOUcontainer.classList.add('player__youContainer', 'player__youContainer--open')
        }
        player__YOU.classList.add('player__you')
        
        player__YOUcontainer.appendChild(player__YOU)
        player__container.appendChild(player__YOUcontainer)

    }

    return player__container

}

function set_up_client_container(current__client){

    const leaderboard_client_container = document.createElement('div')

    leaderboard_client_container.classList.add('leaderboard__currentPlayer-container')

    // leaderboard_client_container.style.animation = `slideFromBottom .1s ease 0s backwards`

    leaderboard_client_container.appendChild(current__client)

    return leaderboard_client_container

}

function displayMatches(matchHistory, leaderboardType){

    /*
        {
            room_id: 1,
            crush_nickname: 'nerdyBoy',
            user_id: 24,
            user_name: 'chicken',
            total_score: 77,
            total_players: 1,
            date: 2022-05-15T02:20:17.000Z
        }
    */

    const leaderboard = document.querySelector(".sidebar")
    const leaderboard__header = document.querySelector(".sidebar__header")
    const leaderboard__container = document.querySelector(".sidebar__players")
    const sidebar__container = document.querySelector('.sidebar__container')
    
    if(document.querySelector(".leaderboard__currentPlayer-container")){
        document.querySelector(".leaderboard__currentPlayer-container").remove()
    }
    leaderboard__container.remove()

    const history__leaderboard = document.createElement("div")

    history__leaderboard.classList.add('sidebar__players',  'sidebar__players--open')

    for(let i = 0; i < matchHistory.length; i++){
        const match = matchHistory[i]

        const match__container = document.createElement('div')
        const match__crushContainer = document.createElement('div')
        const match__crushImg = document.createElement('img')
        const match__hostName = document.createElement('div')
        const match__totalScore = document.createElement('div')
        const match__totalPlayers = document.createElement('div')
        const match__date = document.createElement('div')

        match__container.classList.add('btn', 'match__container')
        match__crushContainer.classList.add('match__crushContainer')
        match__crushImg.classList.add('match__crushImg')
        match__hostName.classList.add('match__hostname')
        match__totalScore.classList.add('match__totalScore')
        match__totalPlayers.classList.add('match__totalPlayers')
        match__date.classList.add('match__date')

        const capitalizeCrush_name = match.crush_nickname.charAt(0).toUpperCase() + match.crush_nickname.slice(1);

        // match__container.style.animation = `slideFromBottom .1s ease ${i -.5}s backwards`
        match__crushImg.src = `assets/character-icon/achieve${capitalizeCrush_name}.png`

        if(leaderboardType === "global"){
            match__hostName.innerText = `Host: ${match.user_name}`
            match__totalScore.innerText = `Top Score: ${match.total_score}`
        } else if(leaderboardType === 'personal'){
            match__hostName.innerText = `User: ${match.user_name}`
            match__totalScore.innerText = `Total Pts: ${match.total_points} pts`
        }

        match__totalPlayers.innerText = `#Players: ${match.total_players}`
        match__date.innerText = `${new Date(match.date).toLocaleString()}`

        match__container.addEventListener("click", (event) => {
            event.preventDefault()

            request_match_detail(match.room_id)

        })

        match__crushContainer.appendChild(match__crushImg)
        match__container.append(match__crushContainer, match__hostName, match__totalPlayers, match__totalScore, match__date)

        history__leaderboard.appendChild(match__container)
    }

    if(leaderboardType === 'global'){
        leaderboard__header.innerHTML = `<i class="fa-solid fa-earth-americas"></i> Global Matches`
    } else if(leaderboardType === 'personal'){
        leaderboard__header.innerHTML = `<i class="fa-solid fa-user"></i> Personal Matches`
    }

    leaderboard.style.animation = 'fadingIn 1s ease backwards'

    sidebar__container.appendChild(history__leaderboard)

}

function matchDetailPage(matchData){

    /*
        avatar_id: 4
        crush_name: "Chadwick \"The Chad\" Johnson"
        crush_nickname: "sportyBoy"
        date: "2022-05-23T21:24:29.000Z"
        easy_category_id: 2
        easy_category_name: "Film & TV"
        easy_errors: 0
        easy_points: 0
        hard_category_id: 2
        hard_category_name: "Film & TV"
        hard_errors: 0
        hard_points: 1
        medium_category_id: 3
        medium_category_name: "Food & Drink"
        medium_errors: 0
        medium_points: 0
        position: 1
        room_id: 9
        room_name: "apples"
        total_errors: 0
        total_points: 1
        user_id: 24
        user_name: "chicken"
    */

    const room_users = matchData.roomUsers

    const leaderboard = document.querySelector('.sidebar')
    const leaderboard__back_btn = document.querySelector('.leaderboard__backBtn')

    leaderboard.remove()
    leaderboard__back_btn.remove()

    let winnerData = {}
    let currentClientData = {}

    for(let i = 0; i < room_users.length; i++){
        if(i === 0){
            winnerData = room_users[i]
            // console.log("matchDataaaa", matchData[i], typeof matchData[i])
            // console.log("matchDataaaa2222", USER_ID, typeof USER_ID)
        }
        if(room_users[i].user_id === +USER_ID){
            // console.log("matchData", matchData[i])
            currentClientData = room_users[i]
            break
        }
    }

    const my_match__back_btn = document.createElement('a')
    const my_match__container = document.createElement('div')
    const my_match__container_top = document.createElement('div')
    const my_match__container_bottom = document.createElement('div')
    const my_match__container_bottom_left = document.createElement('div')
    const my_match__container_bottom_right = document.createElement('div')
    const my_match__container_top_left = document.createElement('div')
    const my_match__container_top_right = document.createElement('div')
    const my_match__crushContainer = document.createElement('div')
    const my_match__crushImg = document.createElement('img')
    const my_match__crush_name = document.createElement('div')
    const my_match__room_detailsContainer = document.createElement('div')
    const my_match__mini_leaderboard_header = document.createElement('div')
    const my_match__mini_leaderboard = document.createElement('div')
    const my_match__mini_leaderboard_player = document.createElement('div')

    my_match__back_btn.classList.add('btn', 'btn__back', 'btn--darkPurple', 'my-match__backBtn')
    my_match__container.classList.add('my-match__container')
    my_match__container_top.classList.add('my-match__container--top')
    my_match__container_bottom.classList.add('my-match__container--bottom')
    my_match__container_bottom_left.classList.add('my-match__container--bottom-left')
    my_match__container_bottom_right.classList.add('my-match__container--bottom-right')
    my_match__container_top_left.classList.add('my-match__container--top-left')
    my_match__container_top_right.classList.add('my-match__container--top-right')
    my_match__crushContainer.classList.add('my-match__crushContainer')
    my_match__crushImg.classList.add('my-match__crush-img')
    my_match__crush_name.classList.add('my-match__crush-name')
    my_match__room_detailsContainer.classList.add('my-match__room-details-container')
    my_match__mini_leaderboard_header.classList.add('my-match__mini-leaderboard-header')
    my_match__mini_leaderboard.classList.add('my-match__mini-leaderboard')
    my_match__mini_leaderboard_player.classList.add('my-match__mini-leaderboard-players')

    const capitalizeCrush_name = currentClientData.crush_nickname.charAt(0).toUpperCase() + currentClientData.crush_nickname.slice(1);
    my_match__crushImg.src = `assets/character-icon/achieve${capitalizeCrush_name}.png`
    my_match__crush_name.innerText = `${currentClientData.crush_name}`
    my_match__back_btn.innerHTML = `<span>&#8618;</span>`
    my_match__mini_leaderboard_header.innerHTML = `Match Leaderboard`


    for(let i = 0; i < 4; i++){

        const my_match__room_details = document.createElement('span')
        my_match__room_details.classList.add('my-match__room-details')

        if(i === 0){
            my_match__room_details.innerText =  `Room Name: ${currentClientData.room_name}`
        } else if(i === 1){
            my_match__room_details.innerText =  `Winner: ${winnerData.user_name}`
        } else if(i === 2){
            my_match__room_details.innerText =  `Top points: ${winnerData.total_points}`
        } else if(i === 3){
            my_match__room_details.innerText =  `Date: ${new Date(currentClientData.date).toLocaleString()}`
        }

        my_match__room_detailsContainer.appendChild(my_match__room_details)

    }

    const difficulties = ['easy', 'medium', 'hard']
    for(let i = 0; i < difficulties.length; i++){

        const trivia_category__container = document.createElement('div')
        const trivia_category__header = document.createElement('div')
        const trivia_category__points_container = document.createElement('div')
        const trivia_category__points = document.createElement('div')
        const trivia_category__errors = document.createElement('div')

        trivia_category__container.classList.add('trivia-category__container')
        trivia_category__header.classList.add('trivia-category__header')
        trivia_category__points_container.classList.add('trivia-category__points-container')
        trivia_category__points.classList.add('trivia-category__info', 'trivia-category__info--green')
        trivia_category__errors.classList.add('trivia-category__info', 'trivia-category__info--purple')

        /*
            easy_category_name: "Film & TV"
            easy_errors: 0
            easy_points: 0
        */

        trivia_category__header.innerText = `Trivia ${difficulties[i]}: ${currentClientData[`${difficulties[i]}_category_name`]}`
        trivia_category__points.innerText = `Points: ${currentClientData[`${difficulties[i]}_points`]} pts`
        trivia_category__errors.innerText = `Errors: ${currentClientData[`${difficulties[i]}_errors`]}`

        trivia_category__points_container.append(trivia_category__points, trivia_category__errors)
        trivia_category__container.append(trivia_category__header, trivia_category__points_container)
        my_match__container_bottom_left.appendChild(trivia_category__container)

    }

    my_match__mini_leaderboard.append(my_match__mini_leaderboard_player)
    my_match__container_bottom_right.append(my_match__mini_leaderboard_header, my_match__mini_leaderboard)

    my_match__container_top_right.append(my_match__crush_name, my_match__room_detailsContainer)

    my_match__crushContainer.append(my_match__crushImg)
    my_match__container_top_left.append(my_match__crushContainer)

    my_match__container_bottom.append(my_match__container_bottom_left, my_match__container_bottom_right)
    my_match__container_top.append(my_match__container_top_left, my_match__container_top_right)
    my_match__container.append(my_match__container_top, my_match__container_bottom)

    document.querySelector('.section-leaderboard').append(my_match__back_btn, my_match__container)

}

function request_global_leaderboard(){
    axios.post('/leaderboard/global/standings')
    .then(res => {

        // Check DB Access for object ( getGlobalLeaderboard )
        console.log('global leaderboard axios.then', res.data.globalLeaderboardData)

        let globalLeaderboard = res.data.globalLeaderboardData.globalLeaderboard
        let current__client = res.data.globalLeaderboardData.userInfo

        global_leaderboard_setup(globalLeaderboard, current__client)

    })
    .catch((err) => {
        // alert('Uh oh')
        console.error("ERROR", err)
    })
}

function request_global_matches(){
    axios.post('/leaderboard/global/history')
        .then(res => {

            // Check DB Access for object ( getGlobalMatchHistory )
            console.log('global history axios.then', res.data.globalHistoryData)

            let globalMatchHistory = res.data.globalHistoryData.globalMatchHistory

            displayMatches(globalMatchHistory, 'global')

        })
        .catch((err) => {
            // alert('Uh oh')
            console.error("ERROR", err)
        })
}

function request_user_history(){
    axios.post('/leaderboard/history')
        .then(res => {

            // Check DB Access for object ( getUserMatchHistory )
            console.log('user history axios.then', res.data.userHistoryData)

            // DOM MANIPULATION HERE

            /*
                {
                    crush_nickname: "sportyBoy"
                    date: "2022-05-23T21:24:29.000Z"
                    easy_category_id: 2
                    easy_category_name: "Film & TV"
                    easy_errors: 0
                    easy_points: 0
                    hard_category_id: 2
                    hard_category_name: "Film & TV"
                    hard_errors: 0
                    hard_points: 1
                    medium_category_id: 3
                    medium_category_name: "Food & Drink"
                    medium_errors: 0
                    medium_points: 0
                    position: 1
                    room_id: 9
                    total_errors: 0
                    total_players: 2
                    total_points: 1
                    user_id: 24
                    user_name: "chicken"
                }
            */
            

            // let user = res.data.userHistoryData.userInfo

            let userMatchHistory = res.data.userHistoryData.userMatchHistory

            displayMatches(userMatchHistory, 'personal')

        })
        .catch((err) => {
            // alert('Uh oh')
            console.error("ERROR", err)
        })
}


function request_match_detail(room_id){
    axios.post('/leaderboard/match', {roomId: room_id})
        .then(res => {

            // Check DB Access for object ( getRoomInformationByRoomId )
            console.log('personal matches detail axios.then', res.data.roomData)

            matchDetailPage(res.data.roomData)
            // DOM MANIPULATION HERE

            let match__leaderboard = res.data.roomData.roomUsers
            
            console.log("match__leaderboard", match__leaderboard)

            let positionNum = 1
            let counter = 0;
            for(let i = 0; counter < match__leaderboard.length; i++){
                let position = returnPosition(positionNum)
                let player = match__leaderboard[counter]
                if(player){
                    console.log("player", player)
                    let playerContainer = displayPlayers(player, position, 'my_match')
                    document.querySelector(".my-match__mini-leaderboard-players").appendChild(playerContainer)
                    counter++
                    positionNum++
                } else{
                    break
                }
            }



        })
        .catch((err) => {
            // alert('Uh oh')
            console.error("ERROR", err)
        })

}


// .leaderboard_icon button ----->>>> global standings leaderboard
document.querySelector('.leaderboard_icon').addEventListener('click', event => {
    event.preventDefault();
    request_global_leaderboard()
})
