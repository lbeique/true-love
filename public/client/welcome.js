// MUSIC

const welcomeMusic = {
    intro: new Howl({
        src: ['../assets/sounds/music/Polkavant - UFO Traveler.mp3'],
        html5: true,
    })
}

const playMusicCallback = () => {
    welcomeMusic.intro.volume(0.5).loop(true).play()
    document.querySelector('body').removeEventListener('click', playMusicCallback)
}

document.querySelector('body').addEventListener('click', playMusicCallback)
