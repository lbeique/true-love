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
    const crush__container = document.createElement('div')
    const crush__text = document.createElement('span')
    const crush = document.createElement('img')

    crush__container.classList.add('crush__container')
    crush__text.classList.add('crush__text')
    crush.classList.add('crush')

    
    crush__text.innerText = `${gameInfo.name}`
    crush.src = `assets/character-fullbody/${gameInfo.nickname}.png`


    const leaderboard__header = document.createElement('h1')
    leaderboard__header.innerText = `............ THE LEADERBOARD ...........`
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

    

    crush__container.appendChild(crush__text)
    crush__container.appendChild(crush)

    crush__container.appendChild(leaderboard__header)
    crush__container.appendChild(leaderboard)
    crush__container.appendChild(dialogue__countainer)

    crush__container.appendChild(crush__timerCountdown)
    section__lounge.appendChild(crush__container)

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
    const crush__container = document.querySelector('.crush__container')

    crush__container.remove()
    section__lounge.classList.add('hide')
})

