const section__splash = document.querySelector('.section-splash')
const section__welcomeScreen = document.querySelector('.section__welcomeScreen')

const splash__img = document.createElement('img')

splash__img.classList.add('splash__img')

splash__img.src = `assets/others/firebugsLogo.png`

function splashHelper () {
    section__splash.classList.add('hide')
    section__welcomeScreen.classList.remove('hide')
}

setTimeout(() => {
    section__splash.classList.add('section-splash--fadeOut')
}, 8000)

setTimeout(() => {
    splashHelper()
   
}, 8500)

section__splash.addEventListener('click', (event) => {
    event.preventDefault()
    splashHelper()
    clearTimeout()
})

section__splash.appendChild(splash__img)
