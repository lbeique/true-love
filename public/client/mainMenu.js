// WHAT A MESS LMAO AAAAAAA

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

    window.sessionStorage.setItem('animated' ,1);

} else{

    document.querySelector('.menu__alienChatter1').classList.add('menu__alienChatter1--skipAnimated');
    document.querySelector('.menu__alienChatter2').classList.add('menu__alienChatter2--skipAnimated');
    document.querySelector('.menu__alienChatter3').classList.add('menu__alienChatter3--skipAnimated');

    document.querySelector('.menu__star1').classList.add('menu__star1--skipAnimated');
    document.querySelector('.menu__star2').classList.add('menu__star2--skipAnimated');
    document.querySelector('.menu__star3').classList.add('menu__star3--skipAnimated');
    document.querySelector('.menu__star4').classList.add('menu__star4--skipAnimated');

}