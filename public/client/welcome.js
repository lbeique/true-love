// MUSIC

const music = {
    intro: new Howl({
        src: ['../assets/sounds/music/Polkavant - UFO Traveler.mp3']
    })
}

const playMusicCallback = () => {
    music.intro.volume(0.5).loop(true).seek(54).play()
    document.querySelector('body').removeEventListener('click', playMusicCallback)
}

document.querySelector('body').addEventListener('click', playMusicCallback)
