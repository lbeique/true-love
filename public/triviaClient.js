const socket = io.connect();

socket.emit('timer', "requesting timer from client")

socket.on('counter', function(count){
    const timerText = document.querySelector(".timer--darkPurple");
  
    timerText.innerHTML = count + "s";
})

socket.on('counter-finish', () => {
    window.location = '/lobby/' // automatically go back to lobby once the timer is up
})


socket.on('trivia_reset_state', (result) => {
    if(result === false){
        alert('Wrong Answer')
    }
    // reset part
    const trivia__container = document.querySelector(".trivia__container") 
    trivia__container.remove()

    socket.emit('trivia_next_question') 
})

socket.on('trivia_start', (trivia) => {

    const section__main = document.querySelector('.section-main--bg1')
    const trivia__container = document.createElement('div')
    const questionContainer = document.createElement('div')
    const question = document.createElement('span')
    const answerContainer = document.createElement('div')

    console.log("TRIVIA client", trivia)

    const answers = [...trivia.incorrect_answers] // copy
    answers.push(trivia.correct_answer)
    answers.sort(() => 0.5 - Math.random()) // shuffle the multiple choices

    answers.map(answer => {
        const answerBtn = document.createElement('button')
        answerBtn.classList.add('btn', 'btn--darkPurple', 'trivia__btn')
        answerBtn.innerText = answer
        answerBtn.addEventListener('click', (event) => {
            event.preventDefault();
            socket.emit('trivia_check_answer', {
                correct_answer: trivia.correct_answer,
                userAnswer: answer
            })
        })

        answerContainer.appendChild(answerBtn)
    })

    trivia__container.classList.add('trivia__container')
    questionContainer.classList.add('trivia__questionContainer')
    question.classList.add('trivia__question')
    answerContainer.classList.add('trivia__answerContainer')

    question.innerHTML = trivia.question

    questionContainer.appendChild(question)
    trivia__container.appendChild(questionContainer)
    trivia__container.appendChild(answerContainer)    
    section__main.appendChild(trivia__container)

})




axios.get("/trivia/")
    .then(() => axios.get("https://opentdb.com/api.php?amount=10&category=20&difficulty=easy&type=multiple"))
    .then(result => {
        socket.emit('trivia_question', result.data.results)
    })
