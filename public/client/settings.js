const socket = io.connect();

let currentTrack = null

const music = {

    musicVolume: MUSIC_STATUS.volume,
    musicMute: MUSIC_STATUS.mute,

    welcome: new Howl({
        src: ['../assets/sounds/music/Polkavant - UFO Traveler.mp3'],
        html5: true,
        volume: musicVolume,
        mute: musicMute,
        onfade: function () {
            music.welcome.stop()
            music.welcome.volume(musicVolume)
        }
    }),
    menu: new Howl({
        src: ['../assets/sounds/music/Polkavant - Monsterpolka.mp3'],
        html5: true,
        volume: musicVolume,
        mute: musicMute,
        onfade: function () {
            music.menu.stop()
            music.menu.volume(musicVolume)
        }
    }),
    lobby: new Howl({
        src: ['../assets/sounds/music/Jahzzar - Take Me Higher.mp3'],
        html5: true,
        volume: musicVolume,
        mute: musicMute,
        onfade: function () {
            music.lobby.stop()
            music.lobby.volume(musicVolume)
        }
    }),
    trivia1: new Howl({
        src: ['../assets/sounds/music/Crowander - Gypsy.mp3'],
        html5: true,
        volume: musicVolume,
        mute: musicMute,
        onfade: function () {
            music.trivia1.stop()
            music.trivia1.volume(musicVolume)
        }
    }),
    trivia2: new Howl({
        src: ["../assets/sounds/music/G.G. Allin's Dick - Pollita Española.mp3"],
        html5: true,
        volume: musicVolume,
        mute: musicMute,
        onfade: function () {
            music.trivia2.stop()
            music.trivia2.volume(musicVolume)
        }
    }),
    trivia3: new Howl({
        src: ['../assets/sounds/music/Sasha Mishkin - Heimweh Polka.mp3'],
        html5: true,
        volume: musicVolume,
        mute: musicMute,
        onfade: function () {
            music.trivia3.stop()
            music.trivia3.volume(musicVolume)
        }
    }),
    lounge: new Howl({
        src: ['../assets/sounds/music/Crowander - Klezmer.mp3'],
        html5: true,
        volume: musicVolume,
        mute: musicMute,
        onfade: function () {
            music.lounge.stop()
            music.lounge.volume(musicVolume)
        }
    }),
    victory: new Howl({
        src: ['../assets/sounds/music/Crowander - American.mp3'],
        html5: true,
        volume: musicVolume,
        mute: musicMute,
        onfade: function () {
            music.victory.stop()
            music.victory.volume(musicVolume)
        }
    }),
}

const sfx = {

    sfxVolume: SFX_STATUS.volume,
    sfxMute: SFX_STATUS.mute,

    positive: new Howl({
        src: ['../assets/sounds/sfx/close.mp3'],
        volume: sfxVolume,
        mute: sfxMute,
    }),
    join: new Howl({
        src: ['../assets/sounds/sfx/join.mp3'],
        volume: sfxVolume,
        mute: sfxMute,
    }),
    expand: new Howl({
        src: ['../assets/sounds/sfx/expand.mp3'],
        volume: sfxVolume,
        mute: sfxMute,
    }),
    minimize: new Howl({
        src: ['../assets/sounds/sfx/minimize.mp3'],
        volume: sfxVolume,
        mute: sfxMute,
    }),
    error: new Howl({
        src: ['../assets/sounds/sfx/error.mp3'],
        volume: sfxVolume,
        mute: sfxMute,
    }),
    timer: new Howl({
        src: ['../assets/sounds/sfx/clock.mp3'],
        volume: sfxVolume,
        mute: sfxMute,
    }),
}


function soundEventListener(event) {

    if (event.target.classList.contains('music_mute')) {
        if (MUSIC_STATUS.mute === false) {
            MUSIC_STATUS.mute = true
        } else {
            MUSIC_STATUS.mute = false
        }
    }

    if (event.target.classList.contains('sfx_mute')) {
        if (SFX_STATUS.mute === false) {
            SFX_STATUS.mute = true
        } else {
            SFX_STATUS.mute = false
        }
    }

    if (event.target.classList.contains('music_mute')) {
        if (MUSIC_STATUS.mute === false) {
            MUSIC_STATUS.mute = true
        } else {
            MUSIC_STATUS.mute = false
        }
    }
}




// AXIOS SESSION GET and UPDATE
async function getSound() {
    axios.get('/music')
        .then(res => {

            MUSIC_STATUS = res.data.user_info.music
            SFX_STATUS = res.data.user_info.sfx

        })
        .catch(() => {
            console.error('axios get sound broke')
        })
}



async function updateSound() {
    let sound_update = {
        music: MUSIC_STATUS,
        sfx: SFX_STATUS,
    }
    axios.post('/music/update', (sound_update))
        .then(res => {

            MUSIC_STATUS = res.data.user_info.music
            SFX_STATUS = res.data.user_info.sfx

        })
        .catch(() => {
            console.error('axios sound update broke')
        })
}


const settingsMenu = document.querySelector('.settingsMenu')
const settings_icon = document.querySelector('.settings__icon')

const settings__text = document.createElement('div')
//const settingsMenu__nav = document.createElement('div')

const exitgame__btn = document.createElement('a')

settings__text.classList.add('settingsMenu__text')
//settingsMenuu__nav.classList.add('settingsMenu__nav')
exitgame__btn.classList.add('btn', 'btn--darkPurple', 'exitGame__btn')

settings__text.innerText = "Settings"
exitgame__btn.innerText = `EXIT GAME`

exitMenu__nav.appendChild(exitMenu__text)
exitMenu__nav.appendChild(exitMenu__btn)

exitMenu.appendChild(exitMenu__nav)

settings_icon.addEventListener('click', (event) => {
    event.preventDefault()
    sfx.positive.play()
    settingsMenu.classList.toggle('hide')
})

let confirm = 0;
exitMenu__btn.addEventListener('click', (event) => { // should have a socket emit that will let everybody know that somebody quit
    // I think this happens when the disconnect emiter is triggered, we just need to display it to the others
    event.preventDefault()
    sfx.positive.play()
    if (confirm == 0) {
        exitMenu__text.innerText = "Are you sure?"
        confirm = 1
    } else {
        window.location.href = '/mainmenu/'
    }
})


{/* <input type="range" min="1" max="100" value="50" class="slider-color" id="id1">





 function volume (val) {

    // Update the display on the slider.
    var barWidth = (val * 90) / 100;
    barFull.style.width = (barWidth * 100) + '%';
    sliderBtn.style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';
}






// Volume
//   <div id="volume" class="fadeout">
//     <div id="barFull" class="bar"></div>
//     <div id="barEmpty" class="bar"></div>
//     <div id="sliderBtn"></div>
//   </div>




// Setup the event listeners to enable dragging of volume slider.
barEmpty.addEventListener('click', function (event) {
    var per = event.layerX / parseFloat(barEmpty.scrollWidth);
    player.volume(per);
});
sliderBtn.addEventListener('mousedown', function () {
    window.sliderDown = true;
});
sliderBtn.addEventListener('touchstart', function () {
    window.sliderDown = true;
});
volume.addEventListener('mouseup', function () {
    window.sliderDown = false;
});
volume.addEventListener('touchend', function () {
    window.sliderDown = false;
});

var move = function (event) {
    if (window.sliderDown) {
        var x = event.clientX || event.touches[0].clientX;
        var startX = window.innerWidth * 0.05;
        var layerX = x - startX;
        var per = Math.min(1, Math.max(0, layerX / parseFloat(barEmpty.scrollWidth)));
        player.volume(per);
    }
};

volume.addEventListener('mousemove', move);
volume.addEventListener('touchmove', move);




.slidecontainer {
  width: 100%;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 25px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  background: #04AA6D;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  background: #04AA6D;
  cursor: pointer;
}
</style>
</head>
<body>

<h1>Custom Range Slider</h1>
<p>Drag the slider to display the current value.</p>

<div class="slidecontainer">
  <input type="range" min="1" max="100" value="50" class="slider" id="myRange">
  <p>Value: <span id="demo"></span></p>
</div>

<script>
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
}
</script>

</body>
</html> */}