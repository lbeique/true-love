const exitMenu = document.querySelector('.exitMenu')
const exit_icon = document.querySelector('.exitMenu__icon')

const exitMenu__text = document.createElement('div')
const exitMenu__nav = document.createElement('div')

const exitMenu__btn = document.createElement('a')

exitMenu__text.classList.add('exitMenu__text')
exitMenu__nav.classList.add('exitMenu__nav')
exitMenu__btn.classList.add('btn', 'btn--darkPurple', 'exitMenu__btn')

exitMenu__text.innerText = "Do you wish to exit while playing?"
exitMenu__btn.innerText = `BACK TO MENU`

exitMenu__nav.appendChild(exitMenu__text)
exitMenu__nav.appendChild(exitMenu__btn)

exitMenu.appendChild(exitMenu__nav)

exit_icon.addEventListener('click', (event) => {
    event.preventDefault()
    exitMenu.classList.toggle('hide')
})

let confirm = 0;
exitMenu__btn.addEventListener('click', (event) => { // should have a socket emit that will let everybody know that somebody quit
    // I think this triggers the disconnect emiter, and the socket user is removed.
    event.preventDefault()
    if(confirm == 0){
        exitMenu__text.innerText = "Are you sure?"
        confirm = 1
    } else {
        window.location.href = '/mainmenu/'
    }
})



