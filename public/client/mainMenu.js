// MUSIC 

const menuMusic = {
    menu1: new Howl({
        src: ['../assets/sounds/music/Polkavant - Monsterpolka.mp3'],
        html5: true,
        onend: function () {
            menuMusic.menu2.volume(0.5).play()
        },
        onplayerror: function () {
            menuMusic.menu1.once('unlock', function () {
                menuMusic.menu1.stop()
                menuMusic.menu1.volume(0.4).play()
            })
        }
    }),
    menu2: new Howl({
        src: ['../assets/sounds/music/Polkavant - UFO Traveler.mp3'],
        html5: true,
        onend: function () {
            menuMusic.menu1.volume(0.4).play()
        }
    })
}

const sfx = {
    positive: new Howl({
        src: ['../assets/sounds/sfx/close.mp3'],
        volue: 0.8,
    })
}


menuMusic.menu1.volume(0.4).play()


// WHAT A MESS LMAO AAAAAAA

document.querySelector('.menu__skip-btn').addEventListener('click', (event) => {
    event.preventDefault()
    sfx.positive.play()

    document.querySelector('.menu__spaceship').classList.remove('menu__spaceship--animated');
    document.querySelector('.menu__spaceBeam').classList.remove('menu__spaceBeam--animated');
    document.querySelector('.menu__title').classList.remove('menu__title--animated');
    document.querySelector('.menu__alien1').classList.remove('menu__alien1--animated');
    document.querySelector('.menu__alien2').classList.remove('menu__alien2--animated');
    document.querySelector('.menu__alienChatter1').classList.remove('menu__alienChatter1--animated');
    document.querySelector('.menu__alienChatter2').classList.remove('menu__alienChatter2--animated');
    document.querySelector('.menu__alienChatter3').classList.remove('menu__alienChatter3--animated');
    document.querySelector('.menu__star1').classList.remove('menu__star1--animated');
    document.querySelector('.menu__star2').classList.remove('menu__star2--animated');
    document.querySelector('.menu__star3').classList.remove('menu__star3--animated');
    document.querySelector('.menu__star4').classList.remove('menu__star4--animated');

    document.querySelector('.menu__star1').classList.remove('menu__star1--animated');
    document.querySelector('.menu__star2').classList.remove('menu__star2--animated');
    document.querySelector('.menu__star3').classList.remove('menu__star3--animated');
    document.querySelector('.menu__star4').classList.remove('menu__star4--animated');

    document.querySelectorAll('.btn__menu').forEach(node => node.classList.remove('btn__menu--animated'));
    document.querySelectorAll('.icon__btn').forEach(node => node.classList.remove('icon__btn--animated'));

    document.querySelector('.menu__alienChatter1').classList.add('menu__alienChatter1--skipAnimated');
    document.querySelector('.menu__alienChatter2').classList.add('menu__alienChatter2--skipAnimated');
    document.querySelector('.menu__alienChatter3').classList.add('menu__alienChatter3--skipAnimated');

    document.querySelector('.menu__star1').classList.add('menu__star1--skipAnimated');
    document.querySelector('.menu__star2').classList.add('menu__star2--skipAnimated');
    document.querySelector('.menu__star3').classList.add('menu__star3--skipAnimated');
    document.querySelector('.menu__star4').classList.add('menu__star4--skipAnimated');

    event.target.classList.add('hide')
    // document.querySelector('.menu__skip-btn').remove()

})



if (window.sessionStorage.getItem('animated') === null) {
    document.querySelector('.menu__spaceship').classList.add('menu__spaceship--animated');
    document.querySelector('.menu__spaceBeam').classList.add('menu__spaceBeam--animated');
    document.querySelector('.menu__title').classList.add('menu__title--animated');
    document.querySelector('.menu__alien1').classList.add('menu__alien1--animated');
    document.querySelector('.menu__alien2').classList.add('menu__alien2--animated');
    document.querySelector('.menu__alienChatter1').classList.add('menu__alienChatter1--animated');
    document.querySelector('.menu__alienChatter2').classList.add('menu__alienChatter2--animated');
    document.querySelector('.menu__alienChatter3').classList.add('menu__alienChatter3--animated');
    document.querySelector('.menu__star1').classList.add('menu__star1--animated');
    document.querySelector('.menu__star2').classList.add('menu__star2--animated');
    document.querySelector('.menu__star3').classList.add('menu__star3--animated');
    document.querySelector('.menu__star4').classList.add('menu__star4--animated');

    document.querySelectorAll('.btn__menu').forEach(node => node.classList.add('btn__menu--animated'));
    document.querySelectorAll('.icon__btn').forEach(node => node.classList.add('icon__btn--animated'));

    setTimeout(() => {
        document.querySelector('.menu__skip-btn').classList.add('hide')
    }, 11000)

    window.sessionStorage.setItem('animated', 1);

} else {

    document.querySelector('.menu__alienChatter1').classList.add('menu__alienChatter1--skipAnimated');
    document.querySelector('.menu__alienChatter2').classList.add('menu__alienChatter2--skipAnimated');
    document.querySelector('.menu__alienChatter3').classList.add('menu__alienChatter3--skipAnimated');

    document.querySelector('.menu__star1').classList.add('menu__star1--skipAnimated');
    document.querySelector('.menu__star2').classList.add('menu__star2--skipAnimated');
    document.querySelector('.menu__star3').classList.add('menu__star3--skipAnimated');
    document.querySelector('.menu__star4').classList.add('menu__star4--skipAnimated');

    document.querySelector('.menu__skip-btn').classList.add('hide')

}
