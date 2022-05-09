socket.on('create-lounge', (gameInfo) => {

    // Game info object will look something like this
    // gameInfo = {
    //     name: 'Albert',
    //     nickname: 'emoBoy',
    //     nextCategory: 'History',
    //     playerFacts: ['User 1 has the most consecutive answers', 'User 3 is falling behind']
    // }
    // all player facts should be handled in the backend

    const section__lounge = document.querySelector('.section-lounge')
    const crush__container = document.createElement('div')
    const crush__text = document.createElement('span')
    const crush = document.createElement('img')


    crush__container.classList.add('crush__container')
    crush__text.classList.add('crush__text')
    crush.classList.add('crush')


    crush__container.appendChild(crush__text)
    crush__container.appendChild(crush)

    section__lounge.appendChild(crush__container)


    const crush__timerCountdown = document.createElement('span')
    crush__timerCountdown.classList.add('timer', 'timer__startTrivia')

    crush__container.appendChild(crush__timerCountdown)

    crush__text.innerText = `${gameInfo.name}`
    crush.src = `assets/character-fullbody/${gameInfo.nickname}.png`

})


socket.on('start-lounge-timer', async function (count, triviaCategory) {
    const timerText = document.querySelector(".timer__startTrivia");

    timerText.innerHTML = `${triviaCategory} trivia in: ${count}s`;
})


socket.on('remove-lounge', () => {
    console.log('remove-lounge')
    const section__lounge = document.querySelector('.section-lounge')
    const crush__container = document.querySelector('.crush__container')
    const players__container = document.querySelector('.players__container')


    crush__container.remove()
    players__container.remove()
    section__lounge.classList.add('hide')
})

