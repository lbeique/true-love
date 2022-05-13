// MUSIC

const welcomeMusic = {
    intro: new Howl({
        src: ['../assets/sounds/music/Polkavant - UFO Traveler.mp3'],
        html5: true,
        onplayerror: function() {
            welcomeMusic.intro.once('unlock', function() {
                welcomeMusic.intro.stop()
                welcomeMusic.intro.volume(0.5).loop(true).play()
            })
        }
    })
}

welcomeMusic.intro.volume(0.5).loop(true).play()



// const playMusicCallback = () => {
//     welcomeMusic.intro.volume(0.5).loop(true).play()
//     document.querySelector('body').removeEventListener('click', playMusicCallback)
// }

// document.querySelector('body').addEventListener('click', playMusicCallback)
