function crushNameToggle(name, easy, medium){
    const slide__text = document.querySelector(".carousel__slideText")
    slide__text.classList.toggle("carousel__slideText--open")
    slide__text.innerText = ''

    if(slide__text.classList.contains('carousel__slideText--open')){
        for(let i = 1; i <= 3; i++){
            const triviaContainer = document.createElement('div')
            const triviaContainer__top = document.createElement('div')
            const triviaContainer__bottom = document.createElement('div')

            triviaContainer.classList.add('crush__triviaContainer')
            triviaContainer__top.classList.add('crush__triviaContainer--top')
            triviaContainer__bottom.classList.add('crush__triviaContainer--bottom')

            triviaContainer__top.innerText = `Trivia ${i}:`
            switch(i){
                case 1:
                    triviaContainer__bottom.innerText = `${easy}`
                    break;
                case 2:
                    triviaContainer__bottom.innerText = `${medium}`
                    break;
                case 3:
                    triviaContainer__bottom.innerText = `???`
                    break;
            }

            triviaContainer.append(triviaContainer__top, triviaContainer__bottom)
            slide__text.appendChild(triviaContainer)

        }
    } else{
        slide__text.innerText = `${name}`
    }

}


socket.on('crush-start', (crushes) => {

    // The client 'crush' objects passed in this array look something like this
    //    {
    //        id: '1',
    //        name: 'Albert',
    //        nickname: 'emoBoy',
    //        categoryEasy: 'History',
    //        categoryMedium: 'Television',
    //    }
    // The hard category is purposefully hidden and will be show as ??? to client

    music.lounge.play()

    const section__crushes = document.querySelector('.section-crushes')
    const carousel = document.createElement('div')
    const carousel__btnLeft = document.createElement('img')
    const carousel__btnRight = document.createElement('img')
    const slide__container = document.createElement('div')
    const slide__text = document.createElement('span')
    const slide = document.createElement('img')

    const carousel__voteButton = document.createElement('btn')

    carousel.classList.add('carousel')
    carousel__btnLeft.classList.add('carousel__btn', 'carousel__btn--left')
    carousel__btnRight.classList.add('carousel__btn', 'carousel__btn--right')

    slide__container.classList.add('carousel__slideContainer')
    slide__text.classList.add( 'carousel__slideText', 'carousel__slideText--original')
    slide.classList.add('carousel__slide', 'carousel__slide--original')

    carousel__voteButton.classList.add('btn', 'btn--green', 'carousel__voteButton', 'carousel__voteButton--original')

    carousel__btnLeft.addEventListener('click', (event) => {
        event.preventDefault()
        sfx.positive.play()

        const shiftedCrush = crushes.shift()
        crushes.push(shiftedCrush)
        if(slide__text.classList.contains('carousel__slideText--open')){
            for(let i = 0; i < 2; i++){
                crushNameToggle(crushes[1].name, crushes[1].categoryEasy, crushes[1].categoryMedium)
            }
        } else{
            slide__text.innerText = `${crushes[1].name}`
        }
    
        slide.src = `assets/character-fullbody/${crushes[1].nickname}.png`

        slide.classList.remove("carousel__slide--animated");
        setTimeout(() => slide.classList.add("carousel__slide--animated"), 0);

        slide__text.classList.remove("carousel__slideText--animated");
        setTimeout(() => slide__text.classList.add("carousel__slideText--animated"), 0);

    }, false)

    carousel__btnRight.addEventListener('click', (event) => {
        event.preventDefault()
        sfx.positive.play()

        const shiftedCrush = crushes.pop()
        crushes.unshift(shiftedCrush)
        // slide__text.innerText = `${crushes[1].name}`
        if(slide__text.classList.contains('carousel__slideText--open')){
            for(let i = 0; i < 2; i++){
                crushNameToggle(crushes[1].name, crushes[1].categoryEasy, crushes[1].categoryMedium)
            }
        } else{
            slide__text.innerText = `${crushes[1].name}`
        }
        
        slide.src = `assets/character-fullbody/${crushes[1].nickname}.png`

        slide.classList.remove("carousel__slide--animated");
        setTimeout(() => slide.classList.add("carousel__slide--animated"), 0);

        slide__text.classList.remove("carousel__slideText--animated");
        setTimeout(() => slide__text.classList.add("carousel__slideText--animated"), 0);

    }, false)

    carousel__voteButton.addEventListener('click', (event) => {
        event.preventDefault()
        sfx.positive.play()

        const votedCrush = crushes[1]
        socket.emit(`voted_crush`, votedCrush)
    })


    slide__text.innerText = `${crushes[1].name}`
    slide.src = `assets/character-fullbody/${crushes[1].nickname}.png`
    carousel__btnLeft.src = 'assets/arrows/arrowLeft.png'
    carousel__btnRight.src = 'assets/arrows/arrowRight.png'

    slide__text.addEventListener('click', (event) => {
        event.preventDefault()

        crushNameToggle(crushes[1].name,crushes[1].categoryEasy, crushes[1].categoryMedium)
        
    })

    carousel__voteButton.innerText = "SELECT!"


    slide__container.appendChild(slide__text)
    slide__container.appendChild(slide)
    slide__container.appendChild(carousel__btnLeft)
    slide__container.appendChild(carousel__btnRight)
    slide__container.appendChild(carousel__voteButton)
    carousel.appendChild(slide__container)
    section__crushes.appendChild(carousel)


    section__crushes.classList.remove('hide')

    socket.emit('room_clients')
})

socket.on('crush_voting_result', (topVotedCrush) => {

    const revealOverlay = document.querySelector('.overlay')
    const reveal__container = document.createElement('div')
    const reveal__containerLeft = document.createElement('div')
    const reveal__containerRight = document.createElement('div')
    const reveal__crush = document.createElement('img')
    const reveal__text = document.createElement('span')
    const reveal__triviaCountdown = document.createElement('span')

    reveal__text.classList.add('overlay__text')
    reveal__crush.classList.add('overlay__crush')
    reveal__container.classList.add('overlay__container')
    reveal__containerLeft.classList.add('overlay__container--left')
    reveal__containerRight.classList.add('overlay__container--right')
    reveal__triviaCountdown.classList.add('timer', 'timer__startTrivia')


    reveal__text.classList.remove('overlay__text--fromCenterToTop')
    setTimeout(() => {
        reveal__text.classList.add('overlay__text--fromCenterToTop')
        reveal__text.innerText = `Your choice is...`
    }, 1000);

    setTimeout(() => {
        reveal__text.classList.add('overlay__text--revealName')
        reveal__text.innerText = `${topVotedCrush.name}!!!`
        reveal__crush.src = `assets/character-fullbody/${topVotedCrush.nickname}.png`
    }, 4000);


    reveal__containerLeft.appendChild(reveal__text)
    reveal__containerLeft.appendChild(reveal__triviaCountdown)
    reveal__containerRight.appendChild(reveal__crush)
    reveal__container.appendChild(reveal__containerLeft)
    reveal__container.appendChild(reveal__containerRight)
    revealOverlay.appendChild(reveal__container)

    revealOverlay.classList.remove('hide')

}, false)



socket.on('start-crush-timer', async function (count, triviaCategory) {
    const timerText = document.querySelector(".timer__startTrivia");

    timerText.innerHTML = `${triviaCategory} trivia in: ${count}s`;
    if (count === 3) {
        music.lounge.fade(1, 0, 3000)
    }
})


socket.on('remove-crush', () => {
    console.log('remove-crush')
    const section__crushes = document.querySelector('.section-crushes')
    const carousel = document.querySelector('.carousel')
    const reveal__container = document.querySelector('.overlay__container')
    const revealOverlay = document.querySelector('.overlay')

    document.querySelector('.player__avatarContainer').classList.remove('margin-left-2')

    reveal__container.remove()
    // carousel.remove()
    carousel.classList.add('hide')
    section__crushes.classList.add('hide')
    revealOverlay.classList.add('hide')

})