
if (window.sessionStorage.getItem('introductory') === null) { 
    const lobbies__section = document.querySelector('.section-lobbies')
    const introductory__section = document.querySelector('.section-introductory')
    const introductory__storyContainer = document.createElement('div')
    const introductory__storySituation = document.createElement('div')
    const introductory__button = document.createElement('div')
    const introductory__skipButton = document.createElement('div')

    introductory__storyContainer.classList.add('introductory__storyContainer')
    introductory__storySituation.classList.add('introductory__storySituation')
    introductory__button.classList.add('btn', 'btn--green', 'introductory__button')
    introductory__skipButton.classList.add('btn', 'menu__skip-btn', 'btn--darkPurple')

    introductory__storyContainer.appendChild(introductory__storySituation)
    introductory__storyContainer.appendChild(introductory__button)
    introductory__section.appendChild(introductory__skipButton)
    introductory__section.appendChild(introductory__storyContainer)

    introductory__skipButton.innerHTML = '&#187;'

    let scriptPart = 0;
    introductory__storySituation.innerHTML = 'You and your Alien friends have come to Earth to win the hearts of the humans!'
    introductory__button.innerHTML = 'How So?'
    introductory__storyContainer.classList.add('introductory__storyContainer--animated')

    introductory__skipButton.addEventListener('click', (event) => {
        event.preventDefault()
        introductory__section.classList.add('hide')
        lobbies__section.classList.remove('hide')
        window.sessionStorage.setItem('introductory' ,1)

    })

    introductory__button.addEventListener('click', (event) => {
        event.preventDefault();
        scriptPart++

        switch(scriptPart){
            case 1:
                introductory__storySituation.innerHTML = 'Impress the humans with your “Earth Knowledge” which should obviously make them love you'
                introductory__button.innerHTML = 'Of Course!'
                break;
        
            case 2:
                introductory__storySituation.innerHTML = 'There is only space for one human at a time on your ship... '
                introductory__button.innerHTML = 'Meaning?'
                break;
        
            case 3:
                introductory__storySituation.innerHTML = 'ONLY ONE OF YOU GETS THE DATE!! LOVE IS WAR !!'
                introductory__button.innerHTML = 'BRING IT'
                introductory__skipButton.classList.add('hide')
                break;

            default: 
                introductory__section.classList.add('hide')
                lobbies__section.classList.remove('hide')
                window.sessionStorage.setItem('introductory' ,1)
        
        }

    })
    
} else{

    document.querySelector('.section-lobbies').classList.remove('hide')

}

