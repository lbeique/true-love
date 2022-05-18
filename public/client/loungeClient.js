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
    const crush__carousel = document.querySelector('.carousel')
    const carousel__slideContainer = document.querySelector('.carousel__slideContainer')

    const crush__dialogueContainer = document.createElement('div')
    const crush__dialogue = document.createElement('div')

    crush__dialogueContainer.classList.add('crush__dialogueContainer')
    crush__dialogue.classList.add('crush__dialogue')

    const lounge__timerContainer = document.createElement('div')
    const lounge__timer = document.createElement('div')

    let counter = 0;
    const dialogues = gameInfo.dialogue
    
    crush__dialogue.innerText = `${gameInfo.dialogue[counter]}!`
    counter++

    crush__dialogue.addEventListener('click', (event) => {
        event.preventDefault()
        if(counter === dialogues.length){
            counter = 0
        }
        crush__dialogue.innerText = `${gameInfo.dialogue[counter]}!`
        counter++
    })

    setInterval(function () {
        if(counter === dialogues.length){
            counter = 0
        }
        crush__dialogue.innerText = `${gameInfo.dialogue[counter]}!`
        counter++
     }, 10000);

    if(gameInfo.nickname.includes('Boy')){
        lounge__timerContainer.classList.add('lounge__timerContainer', 'lounge__timerContainer--boy')
        lounge__timer.classList.add('lounge__timer', 'lounge__timer--boy')

    } else {
        lounge__timerContainer.classList.add('lounge__timerContainer', 'lounge__timerContainer--girl')
        lounge__timer.classList.add('lounge__timer', 'lounge__timer--girl')
        
    }

    lounge__timerContainer.appendChild(lounge__timer)
    crush__dialogueContainer.appendChild(crush__dialogue)

    carousel__slideContainer.appendChild(lounge__timerContainer)
    carousel__slideContainer.appendChild(crush__dialogueContainer)
    section__lounge.appendChild(crush__carousel)

    crush__carousel.classList.remove('hide')
    section__lounge.classList.remove('hide')
})

socket.on('start-lounge-timer', async function (count, triviaCategory) {
    const timerText = document.querySelector(".lounge__timer");

    timerText.innerHTML = `${triviaCategory} trivia in: ${count}s`;
    if (count === 5) {
        music.lounge.fade(1, 0, 3000)
    }
})


socket.on('remove-lounge', () => {
    console.log('remove-lounge')
    const section__lounge = document.querySelector('.section-lounge')
    const player__position = document.querySelectorAll('.player__position')
    const crush__dialogueContainer = document.querySelector('.crush__dialogueContainer')
    const lounge__timerContainer = document.querySelector('.lounge__timerContainer')

    player__position.forEach((node) => node.remove())
    lounge__timerContainer.remove()
    crush__dialogueContainer.remove()
    
    section__lounge.classList.add('hide')
})

