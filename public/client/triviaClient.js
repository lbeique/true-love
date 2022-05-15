// MUSIC HOLY FUCK IM SORRY
socket.on('start-trivia-music', (triviaIndex) => {

    if (triviaIndex === 0) {
        console.log('hi! 0', `${triviaTrack}`)
        if (triviaTrack === music.trivia1) {
            triviaTrack.seek(0).play() // Gypsy
        } else if (triviaTrack === music.trivia2) {
            triviaTrack.seek(0).play() // Dick
        } else if (triviaTrack === music.trivia3) {
            triviaTrack.seek(0).play() // Polka
        }
        // else if (triviaTrack === music.trivia4) {
        //     triviaTrack.seek(0).play() // Propane
        // }
    } else if (triviaIndex === 1) {
        console.log('hi! 1', `${triviaTrack}`)
        if (triviaTrack === music.trivia1) {
            triviaTrack.seek(60).play() // Gypsy
        } else if (triviaTrack === music.trivia2) {
            triviaTrack.seek(56).play() // Dick
        } else if (triviaTrack === music.trivia3) {
            triviaTrack.seek(59).play() // Polka
        }
        // else if (triviaTrack === music.trivia4) {
        //     triviaTrack.seek(117).play() // Propane
        // }
    } else if (triviaIndex === 2) {
        console.log('hi! 2', `${triviaTrack}`)
        if (triviaTrack === music.trivia1) {
            triviaTrack.seek(105).play() // Gypsy
        } else if (triviaTrack === music.trivia2) {
            triviaTrack.seek(76).play() // Dick
        } else if (triviaTrack === music.trivia3) {
            triviaTrack.seek(88).play() // Polka
        }
        // else if (triviaTrack === music.trivia4) {
        //     triviaTrack.seek(156).play() // Propane
        // }
    }
})

socket.on('start-trivia-timer', async function (count) {
    const timerText = document.querySelector(".timer__trivia");

    timerText.innerHTML = count + "s";
    if (count === 7) {
        sfx.timer.volume(0.6).play()
    }
    if (count === 5) {
        triviaTrack.fade(0.8, 0, 3000)
    }
})

socket.on('trivia-question', (trivia, animate, points) => {

    // trivia object for the client looks like this
    // {
    //     difficult: 'easy',
    //     category: 'Science',
    //     shuffledAnswers: ['Black', 'Blue', 'Red', 'Yellow'],
    //     animated: 0,
    //     index: 0,
    //     question: 'What is my favourite colour?'
    // }
    // Trying to limit the amount of information the client has access to

    if (document.querySelector(".trivia__container")) {
        document.querySelector(".trivia__container").remove()
        document.querySelector('.trivia__scoreText').remove()
    }

    if (!trivia) {
        const section__main = document.querySelector('.section-trivia')
        const trivia__container = document.createElement('div')
        trivia__container.classList.add('trivia__container')

        const scoreText = document.createElement('h1')
        scoreText.classList.add('heading-primary', 'trivia__scoreText')
        scoreText.innerText = `Current Trivia Score: ${points}`

        const outOfQuestions = document.createElement('p')
        outOfQuestions.innerText = `You are out of Questions! You are too smart :)`
        trivia__container.appendChild(outOfQuestions)

        section__main.appendChild(scoreText)
        section__main.appendChild(trivia__container)
    } else {
        const section__main = document.querySelector('.section-trivia')
        const trivia__container = document.createElement('div')
        const question = document.createElement('div')
        const answerContainer = document.createElement('div')

        const scoreText = document.createElement('h1')
        scoreText.classList.add('heading-primary', 'trivia__scoreText')
        scoreText.innerText = `Current Trivia Score: ${points}`

        const answers = trivia.shuffledAnswers

        for (let i = 0; i < answers.length; i++) {
            const answerBtn = document.createElement('button')
            answerBtn.classList.add('btn', 'btn--darkPurple', 'trivia__btn')
            answerBtn.innerText = answers[i]
            answerBtn.addEventListener('click', (event) => {
                event.preventDefault();
                sfx.positive.play()
                socket.emit('trivia_check_answer', answers[i])
            })

            answerContainer.appendChild(answerBtn)
        }

        trivia__container.classList.add('trivia__container')
        question.classList.add('trivia__question')
        if (+animate === 0) {
            question.classList.add('trivia__question--animated')
            answerContainer.classList.add('trivia__answerContainer--animated')
        }
        answerContainer.classList.add('trivia__answerContainer')

        question.innerHTML = trivia.question

        trivia__container.appendChild(question)
        trivia__container.appendChild(answerContainer)
        section__main.appendChild(scoreText)
        section__main.appendChild(trivia__container)

        section__main.classList.remove('hide')
    }

})

socket.on('trivia_false', () => {
    sfx.error.play()
    const answer__container = document.querySelector('.trivia__answerContainer')
    const cross = document.createElement('img')
    const section__main = document.querySelector('.section-trivia')
    cross.classList.add('cross')

    cross.src = 'assets/others/X.png'

    section__main.appendChild(cross)

    answer__container.classList.remove('trivia__answerContainer--unclickable')
    setTimeout(() => {
        answer__container.classList.add('trivia__answerContainer--unclickable')
        cross.remove()
    }, 1000)
})

socket.on('remove-trivia', () => {
    const section__main = document.querySelector('.section-trivia')
    const trivia__container = document.querySelector('.trivia__container')
    const scoreText = document.querySelector('.trivia__scoreText')

    // scoreText.innerText = `Current Trivia Score: 0`

    trivia__container.remove()
    scoreText.remove()
    section__main.classList.add('hide')
    console.log('trivia assets removed')
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