socket.on('game-start', () => {
    console.log('RUN')
    socket.emit('request_crushes')
})

socket.on('set_crushes-carousel', (crushes) => {
    console.log('RUNNN', crushes)

    const section__crushes = document.querySelector('.section-crushes')
    const carousel = document.createElement('div')
    const carousel__btnLeft = document.createElement('img')
    const carousel__btnRight = document.createElement('img')
    const slide__container = document.createElement('div')
    const slide__text = document.createElement('span')
    const slide = document.createElement('img')

    const carousel__voteButton = document.createElement('btn')

    carousel.classList.add('carousel')
    carousel__btnLeft.classList.add('carousel__btn','carousel__btn--left')
    carousel__btnRight.classList.add('carousel__btn', 'carousel__btn--right')

    slide__container.classList.add('carousel__slideContainer')
    slide__text.classList.add('carousel__slideText')
    slide.classList.add('carousel__slide')

    carousel__voteButton.classList.add('btn', 'btn--green', 'carousel__voteButton')

    carousel__btnLeft.addEventListener('click', (event) => {
        event.preventDefault()

        const shiftedCrush = crushes.shift()
        crushes.push(shiftedCrush)
        slide__text.innerText = `${crushes[1].name}`
        slide.src = `assets/character-fullbody/${crushes[1].nickname}.png`

        slide.classList.remove("carousel__slide--animated");
        setTimeout(() => slide.classList.add("carousel__slide--animated"), 0);
        
        slide__text.classList.remove("carousel__slideText--animated");
        setTimeout(() => slide__text.classList.add("carousel__slideText--animated"), 0);

    }, false)

    carousel__btnRight.addEventListener('click', (event) => {
        event.preventDefault()

        const shiftedCrush = crushes.pop()
        crushes.unshift(shiftedCrush)
        slide__text.innerText = `${crushes[1].name}`
        slide.src = `assets/character-fullbody/${crushes[1].nickname}.png`
        
        slide.classList.remove("carousel__slide--animated");
        setTimeout(() => slide.classList.add("carousel__slide--animated"), 0);

        slide__text.classList.remove("carousel__slideText--animated");
        setTimeout(() => slide__text.classList.add("carousel__slideText--animated"), 0);

    }, false)


    slide__text.innerText = `${crushes[1].name}`
    slide.src = `assets/character-fullbody/${crushes[1].nickname}.png`
    carousel__btnLeft.src = 'assets/arrows/arrowLeft.png'
    carousel__btnRight.src = 'assets/arrows/arrowRight.png'

    carousel__voteButton.innerText = "SELECT!"

    
    slide__container.appendChild(slide)

    carousel.appendChild(slide__text)
    carousel.appendChild(carousel__btnLeft)
    carousel.appendChild(slide__container)
    carousel.appendChild(carousel__btnRight)
    carousel.appendChild(carousel__voteButton)
    section__crushes.appendChild(carousel)

    section__crushes.classList.remove('hide')

    socket.emit('room_clients')
})



socket.on('receive room_clients', (room) => {

    const clients = room.clients

    // const clients = {
    //     emo1:{
    //         avatar: '🦄',
    //         username: '1 BOB'
    //     },
    //     emo2:{
    //         avatar: '🦄',
    //         username: '2 BOB'
    //     },
    //     emo3:{
    //         avatar: '🦄',
    //         username: '3 BOB'
    //     },
    //     emo4:{
    //         avatar: '🦄',
    //         username: '4 BOB'
    //     },
    //     emo5:{
    //         avatar: '🦄',
    //         username: '5 BOB'
    //     },
    //     emo6:{
    //         avatar: '🦄',
    //         username: '6 BOB'
    //     },
    //     emo7:{
    //         avatar: '🦄',
    //         username: '7 BOB'
    //     }

    // }

    const section__crushes = document.querySelector('.section-crushes')
    const players__container = document.createElement('div')
    const players__ul = document.createElement('ul')
    const players__btnLeft = document.createElement('img')
    const players__btnRight = document.createElement('img')

    players__container.classList.add('players__container')
    players__ul.classList.add('players__listContainer')
    players__btnLeft.classList.add('players__btn','players__btn--left')
    players__btnRight.classList.add('players__btn', 'players__btn--right')

    players__btnLeft.src = 'assets/arrows/smallArrowLeft.png'
    players__btnRight.src = 'assets/arrows/smallArrowRight.png'

    const clientsInArr = [];

    for(let client in clients){
        clientsInArr.push(clients[client])
    }

    // [1, 2, 3, 4, 5]

    let startingIndex = 0; // 123

    players__btnLeft.addEventListener('click', (event) => {
        event.preventDefault()
        console.log(startingIndex)
        if(startingIndex >= 3){ // 6
            players__ul.innerHTML = ''
            for(let i = 0; i < 3; i++){
                players__ul.prepend(displayUsers(clientsInArr[startingIndex - 1])) // 6 - 5 - 4
                startingIndex--
            }
        }
        
        players__ul.classList.remove("players__listContainer--animated");
        setTimeout(() => players__ul.classList.add("players__listContainer--animated"), 0);

    })

    // slice does not effect the reference
    // splice effects the reference

    players__btnRight.addEventListener('click', (event) => {
        event.preventDefault()

        if(startingIndex <= clientsInArr.length - 1){
            players__ul.innerHTML = ''
            for(let i = 0; i < 3; i++){
                console.log(startingIndex)
                if(startingIndex === clientsInArr.length -1){
                    i = 3
                } 
                players__ul.appendChild(displayUsers(clientsInArr[startingIndex]))
                if(startingIndex < clientsInArr.length - 1){ // 7 does not exist
                    startingIndex++
                }
            }
        }
 
        players__ul.classList.remove("players__listContainer--animated");
        setTimeout(() => players__ul.classList.add("players__listContainer--animated"), 0);
    })


    for(let i = 0; i < 3; i++){
        players__ul.appendChild(displayUsers(clientsInArr[i]))
        startingIndex++ // 1, 2, 3
    }

    players__container.appendChild(players__btnLeft)
    players__container.appendChild(players__ul)
    players__container.appendChild(players__btnRight)
    section__crushes.appendChild(players__container)

})

function displayUsers(client){
    console.log('client', client)
    
        const client__li = document.createElement('li')
        const client__avatar = document.createElement('img')
        const client__name = document.createElement('span')
        const client__vote = document.createElement('span')
        const client__topBar = document.createElement('div')
        const client__bottomBar = document.createElement('div')

        client__li.classList.add('client')
        client__avatar.classList.add('client__avatar')
        client__name.classList.add('client__name')
        client__vote.classList.add('client__vote')
        client__topBar.classList.add('client__topBar')
        client__bottomBar.classList.add('client__bottomBar')

        client__avatar.innerText = `${client.avatar}`
        client__name.innerText = `${client.username}`
        client__vote.innerHTML = `thinking <span class="dots"> ... </span>`

        client__topBar.appendChild(client__avatar)
        client__topBar.appendChild(client__name)
        client__bottomBar.appendChild(client__vote)
        client__li.appendChild(client__topBar)
        client__li.appendChild(client__bottomBar)
        return client__li


}




