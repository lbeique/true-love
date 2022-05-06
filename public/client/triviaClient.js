socket.on('trivia-game-start', () => {
    //console.log('timer start')
    //socket.emit('timer', 15)
    axios.get(`/lobby/${ROOM_ID}`)
        .then(() => axios.get("https://opentdb.com/api.php?amount=30&category=18&difficulty=easy&type=multiple"))
        .then(result => {
            console.log('axios get')
            socket.emit('trivia_question', result.data.results)
        })
})

socket.on('start-trivia-timer', async function (count) {
    const timerText = document.querySelector(".timer__trivia");

    timerText.innerHTML = count + "s";
})

socket.on('remove-trivia', () => {
    console.log('trivia assets removed')
    const section__main = document.querySelector('.section-trivia')
    const trivia__container = document.querySelector('.trivia__container')
    
    trivia__container.remove()
    section__main.classList.add('hide')
})

socket.on('trivia_reset_state', (data) => {
    if (data.result === false) {
        const answer__container = document.querySelector('.trivia__answerContainer')
        const cross = document.createElement('img')
        const section__main = document.querySelector('.section-trivia')
        cross.classList.add('cross')

        cross.src = 'assets/X.png'

        section__main.appendChild(cross)

        answer__container.classList.remove('trivia__answerContainer--unclickable')
        setTimeout(() => {
            answer__container.classList.add('trivia__answerContainer--unclickable')
            cross.remove()
        }, 1000)

    }

    const scoreText = document.querySelector('.trivia__scoreText')

    scoreText.innerText = `Your score: ${data.points}`

    // reset part
    const trivia__container = document.querySelector(".trivia__container")
    trivia__container.remove()

    socket.emit('trivia_next_question')
})

socket.on('trivia_start', (trivia) => {

    const section__main = document.querySelector('.section-trivia')
    const trivia__container = document.createElement('div')
    const question = document.createElement('div')
    const answerContainer = document.createElement('div')

    const answers = trivia.shuffledAnswers

    for (let i = 0; i < answers.length; i++) {
        const answerBtn = document.createElement('button')
        answerBtn.classList.add('btn', 'btn--darkPurple', 'trivia__btn')
        answerBtn.innerText = answers[i]
        answerBtn.addEventListener('click', (event) => {
            event.preventDefault();
            socket.emit('trivia_check_answer', {
                correct_answer: trivia.correct_answer,
                userAnswer: answers[i]
            })
        })

        answerContainer.appendChild(answerBtn)
    }

    trivia__container.classList.add('trivia__container')
    question.classList.add('trivia__question')
    if (trivia.animated === 0) {
        question.classList.add('trivia__question--animated')
        answerContainer.classList.add('trivia__answerContainer--animated')
    }
    answerContainer.classList.add('trivia__answerContainer')

    question.innerHTML = trivia.question

    trivia__container.appendChild(question)
    trivia__container.appendChild(answerContainer)
    section__main.appendChild(trivia__container)

    section__main.classList.remove('hide')

})
