// POORLY CODED MUSIC BULLSHIT
socket.on('start-trivia-music', (triviaIndex) => {

    if (triviaIndex === 0) {
        // console.log('hi! 0', `${triviaTrack}`)
        if (triviaTrack === music.trivia1) {
            triviaTrack.seek(0).play() // Gypsy
        } else if (triviaTrack === music.trivia2) {
            triviaTrack.seek(0).play() // Dick
        } else if (triviaTrack === music.trivia3) {
            triviaTrack.seek(0).play() // Polka
        }
    } else if (triviaIndex === 1) {
        // console.log('hi! 1', `${triviaTrack}`)
        if (triviaTrack === music.trivia1) {
            triviaTrack.seek(60).play() // Gypsy
        } else if (triviaTrack === music.trivia2) {
            triviaTrack.seek(56).play() // Dick
        } else if (triviaTrack === music.trivia3) {
            triviaTrack.seek(59).play() // Polka
        }
    } else if (triviaIndex === 2) {
        // console.log('hi! 2', `${triviaTrack}`)
        if (triviaTrack === music.trivia1) {
            triviaTrack.seek(105).play() // Gypsy
        } else if (triviaTrack === music.trivia2) {
            triviaTrack.seek(76).play() // Dick
        } else if (triviaTrack === music.trivia3) {
            triviaTrack.seek(88).play() // Polka
        }
    }
})

socket.on('start-trivia-timer', async function (count) {
    const timerText = document.querySelector(".timer__trivia");

    timerText.innerHTML = count + "s";
    if (count === 7) {
        sfx.timer.play()
    }
    if (count === 5) {
        triviaTrack.fade(MUSIC_STATUS.volume, 0, 3000)
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

    if(document.querySelector('.cross')){
        document.querySelector('.cross').remove()
    }

    if (document.querySelector(".trivia__container")) {
        document.querySelector(".trivia__container").remove()
        document.querySelector('.trivia__scoreText').remove()
    }

    if (!trivia) {
        const section__trivia = document.querySelector('.section-trivia')
        const trivia__container = document.createElement('div')
        trivia__container.classList.add('trivia__container')

        const scoreText = document.createElement('h1')
        scoreText.classList.add('heading-primary', 'trivia__scoreText')
        scoreText.innerText = `Current Trivia Score: ${points}`

        const outOfQuestions = document.createElement('p')
        outOfQuestions.innerText = `You are out of Questions! You are too smart :)`
        trivia__container.appendChild(outOfQuestions)

        section__trivia.appendChild(scoreText)
        section__trivia.appendChild(trivia__container)

    } else {

        const section__trivia = document.querySelector('.section-trivia')
        // const section__sidebar = document.querySelector('.section-sidebar')
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
            answerBtn.innerHTML = `${answers[i]}`
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
        section__trivia.appendChild(scoreText)
        section__trivia.appendChild(trivia__container)

        section__trivia.classList.remove('hide')
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

    const section__trivia = document.querySelector('.section-trivia')
    const trivia__container = document.querySelector('.trivia__container')
    const scoreText = document.querySelector('.trivia__scoreText')
    const sidebar__overlay = document.querySelector('.sidebar__overlay')
   
    
    sidebar__overlay.remove()

    trivia__container.remove()
    scoreText.remove()
    section__trivia.classList.add('hide')
    // console.log('trivia assets removed')

})