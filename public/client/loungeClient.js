socket.on('create-lounge', (gameInfo) => {

    // Game info object will look something like this
    // gameInfo = {
    //     name: 'Albert',
    //     nickname: 'emoBoy',
    //     nextCategory: 'History',
    //     leaderboard: [{userId: 324, 'Bob', avatar: 'unicorn', points: 17}, {}]
    //     dialogue: ['User 1 has the most consecutive answers', 'User 3 is falling behind']
    // }
    // all player facts should be handled in the backend

    console.log(gameInfo)
    music.lounge.play()
    const section__lounge = document.querySelector('.section-lounge')
    const lounge__left = document.createElement('div')
    const lounge__right = document.createElement('div')
    const lounge__container = document.createElement('div')
    const crush__text = document.createElement('span')
    const crush = document.createElement('img')

    lounge__left.classList.add('crush__containerLeft')
    lounge__right.classList.add('crush__containerRight')
    lounge__container.classList.add('lounge__container')
    crush__text.classList.add('crush__text')
    crush.classList.add('crush')

    // crush__container.style.display = 'flex'
    // crush.style.alignSelf = 'right'
    
    crush__text.innerText = `${gameInfo.name}`
    crush.src = `assets/character-fullbody/${gameInfo.nickname}.png`


    

    const leaderboard__header = document.createElement('h1')
    leaderboard__header.innerText = `............ THE LEADERBOARD ............`
    leaderboard__header.classList.add('leaderboard-header')

    const leaderboard = document.createElement('div')
    leaderboard.classList.add('leaderboard-list')

    console.log(gameInfo.leaderboard.length)
    for (let i = 0; i < gameInfo.leaderboard.length; i++) {
        const entry = document.createElement('p')
        entry.innerText = `#${i + 1}  --  ${gameInfo.leaderboard[i].username} with ${gameInfo.leaderboard[i].points} points`
        entry.classList.add(`user${i + 1}`)
        leaderboard.appendChild(entry)
    }

    const dialogue__countainer = document.createElement('div')
    dialogue__countainer.classList.add('dialogue-list')
    for (let i = 0; i < gameInfo.dialogue.length; i++) {
        const game_text = document.createElement('p')
        game_text.innerText = `${gameInfo.dialogue[i]}`
        game_text.classList.add(`dialogue${i}`)
        dialogue__countainer.appendChild(game_text)
    }
    
    const crush__timerCountdown = document.createElement('span')
    crush__timerCountdown.classList.add('timer', 'timer__lounge')


    lounge__left.appendChild(leaderboard__header)
    lounge__left.appendChild(leaderboard)
    

    lounge__right.appendChild(crush)
    lounge__right.appendChild(crush__text)
    lounge__right.appendChild(dialogue__countainer)

    section__lounge.appendChild(crush__timerCountdown)
    lounge__container.appendChild(lounge__left)
    lounge__container.appendChild(lounge__right)

    section__lounge.appendChild(lounge__container)

    // crush__container.appendChild(crush__text)
    // crush__container.appendChild(crush)

    // leaderboard__container.appendChild(leaderboard__header)
    // leaderboard__container.appendChild(leaderboard)

    // crush__container.appendChild(leaderboard__header)
    // crush__container.appendChild(leaderboard)
    // crush__container.appendChild(dialogue__countainer)

    
    // crush__container.appendChild(crush__timerCountdown)

    // section__lounge.appendChild(leaderboard__container)
    // section__lounge.appendChild(crush__container)

    section__lounge.classList.remove('hide')
})


socket.on('start-lounge-timer', async function (count, triviaCategory) {
    const timerText = document.querySelector(".timer__lounge");

    timerText.innerHTML = `${triviaCategory} trivia in: ${count}s`;
    if (count === 5) {
        music.lounge.fade(1, 0, 3000)
    }
})


socket.on('remove-lounge', () => {
    console.log('remove-lounge')
    const section__lounge = document.querySelector('.section-lounge')
    const lounge__container = document.querySelector('.lounge__container')

    lounge__container.remove()
    section__lounge.classList.add('hide')
})

