const socket = io.connect();

let triviaTrack = null

const music = {
    welcome: new Howl({
        src: ['../assets/sounds/music/Polkavant - UFO Traveler.mp3'],
        html5: true,
        volume: 0.8,
        onfade: function () {
            music.welcome.stop()
            music.welcome.volume(1)
        }
    }),
    menu: new Howl({
        src: ['../assets/sounds/music/Polkavant - Monsterpolka.mp3'],
        html5: true,
        volume: 0.8,
        onfade: function () {
            music.menu.stop()
            music.menu.volume(1)
        }
    }),
    lobby: new Howl({
        src: ['../assets/sounds/music/Jahzzar - Take Me Higher.mp3'],
        html5: true,
        volume: 0.8,
        onfade: function () {
            music.lobby.stop()
            music.lobby.volume(1)
        }
    }),
    trivia1: new Howl({
        src: ['../assets/sounds/music/Crowander - Gypsy.mp3'],
        html5: true,
        volume: 0.8,
        onfade: function () {
            music.trivia1.stop()
            music.trivia1.volume(1)
        }
    }),
    trivia2: new Howl({
        src: ["../assets/sounds/music/G.G. Allin's Dick - Pollita Española.mp3"],
        html5: true,
        volume: 0.8,
        onfade: function () {
            music.trivia2.stop()
            music.trivia2.volume(1)
        }
    }),
    trivia3: new Howl({
        src: ['../assets/sounds/music/Sasha Mishkin - Heimweh Polka.mp3'],
        html5: true,
        volume: 0.8,
        onfade: function () {
            music.trivia3.stop()
            music.trivia3.volume(1)
        }
    }),
    lounge: new Howl({
        src: ['../assets/sounds/music/Crowander - Klezmer.mp3'],
        html5: true,
        volume: 0.8,
        onfade: function () {
            music.lounge.stop()
            music.lounge.volume(1)
        }
    }),
    victory: new Howl({
        src: ['../assets/sounds/music/Crowander - American.mp3'],
        html5: true,
        onfade: function () {
            music.victory.stop()
            music.victory.volume(1)
        }
    }),
}

const sfx = {
    positive: new Howl({
        src: ['../assets/sounds/sfx/close.mp3'],
        volume: 0.3,
    }),
    join: new Howl({
        src: ['../assets/sounds/sfx/join.mp3']
    }),
    expand: new Howl({
        src: ['../assets/sounds/sfx/expand.mp3']
    }),
    minimize: new Howl({
        src: ['../assets/sounds/sfx/minimize.mp3']
    }),
    error: new Howl({
        src: ['../assets/sounds/sfx/error.mp3']
    }),
    timer: new Howl({
        src: ['../assets/sounds/sfx/clock.mp3']
    }),
}





axios.post('/music')
.then(res => {
    let music = res.data.music
    let sfx = res.data.sfx
    

    console.log(res.data)



})
.catch(() => {
})