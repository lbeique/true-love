let currentTrack = null
let triviaTrack = null
let userLocation = null
let music
let sfx
let MUSIC_STATUS
let SFX_STATUS

function setTriviaTrack() {
    let tracks = [music.trivia1, music.trivia2, music.trivia3]
    triviaTrack = tracks[Math.floor(Math.random() * tracks.length)]
}

axios.post('/music')
    .then(res => {

        MUSIC_STATUS = res.data.user_info.music_status
        SFX_STATUS = res.data.user_info.sfx_status
        userLocation = res.data.user_info.location
        console.log('MUSIC_STATUS', MUSIC_STATUS)
        console.log('SFX_STATUS', SFX_STATUS)


        music = {

            welcome: new Howl({
                src: ['../assets/sounds/music/Polkavant-UFO-Traveler.mp3'],
                html5: true,
                volume: MUSIC_STATUS.volume,
                mute: MUSIC_STATUS.mute,
                onfade: function () {
                    music.welcome.stop()
                    music.welcome.volume(MUSIC_STATUS.volume)
                },
                onplayerror: function () {
                    if (userLocation === 'welcome') {
                        music.welcome.once('unlock', function () {
                            music.welcome.stop()
                            music.welcome.play()
                        })
                    } else if (userLocation === 'lobby') {
                        music.welcome.once('unlock', function () {
                            music.welcome.stop()
                            music.welcome.seek(54).play()
                        })
                    }
                },
                onend: function () {
                    if (userLocation === 'welcome') {
                        music.welcome.play()
                    } else if (userLocation === 'menu') {
                        music.menu.play()
                    } else if (userLocation === 'lobby') {
                        music.menu.play()
                    } else if (userLocation === 'login') {
                        music.welcome.play()
                    } else if (userLocation === 'signup') {
                        music.welcome.play()
                    }
                },
                onplay: function () {
                    currentTrack = music.welcome
                }
            }),
            menu: new Howl({
                src: ['../assets/sounds/music/Polkavant-Monsterpolka.mp3'],
                html5: true,
                volume: MUSIC_STATUS.volume,
                mute: MUSIC_STATUS.mute,
                onfade: function () {
                    music.menu.stop()
                    music.menu.volume(MUSIC_STATUS.volume)
                },
                onplayerror: function () {
                    if (userLocation === 'menu') {
                        music.menu.once('unlock', function () {
                            music.menu.stop()
                            music.menu.play()
                        })
                    }
                },
                onend: function () {
                    if (userLocation === 'menu') {
                        music.welcome.play()
                    } else if (userLocation === 'lobby') {
                        music.welcome.play()
                    }
                },
                onplay: function () {
                    currentTrack = music.menu
                }
            }),
            lobby: new Howl({
                src: ['../assets/sounds/music/Jahzzar-Take-Me-Higher.mp3'],
                html5: true,
                volume: MUSIC_STATUS.volume,
                mute: MUSIC_STATUS.mute,
                onfade: function () {
                    music.lobby.stop()
                    music.lobby.volume(MUSIC_STATUS.volume)
                },
                onplayerror: function () {
                    if (userLocation === 'game') {
                        music.lobby.once('unlock', function () {
                            music.lobby.stop()
                            music.lobby.play()
                        })
                    }
                },
                onend: function () {
                    if (userLocation === 'game') {
                        music.lobby.play()
                    }
                },
                onplay: function () {
                    currentTrack = music.lobby
                }
            }),
            trivia1: new Howl({
                src: ['../assets/sounds/music/Crowander-Gypsy.mp3'],
                html5: true,
                volume: MUSIC_STATUS.volume,
                mute: MUSIC_STATUS.mute,
                onfade: function () {
                    music.trivia1.stop()
                    music.trivia1.volume(MUSIC_STATUS.volume)
                },
                onplay: function () {
                    currentTrack = music.trivia1
                }
            }),
            trivia2: new Howl({
                src: ["../assets/sounds/music/GG-Allins-Dick-Pollita-Espaola.mp3"],
                html5: true,
                volume: MUSIC_STATUS.volume,
                mute: MUSIC_STATUS.mute,
                onfade: function () {
                    music.trivia2.stop()
                    music.trivia2.volume(MUSIC_STATUS.volume)
                },
                onplay: function () {
                    currentTrack = music.trivia2
                }
            }),
            trivia3: new Howl({
                src: ['../assets/sounds/music/Sasha-Mishkin-Heimweh-Polka.mp3'],
                html5: true,
                volume: MUSIC_STATUS.volume,
                mute: MUSIC_STATUS.mute,
                onfade: function () {
                    music.trivia3.stop()
                    music.trivia3.volume(MUSIC_STATUS.volume)
                },
                onplay: function () {
                    currentTrack = music.trivia3
                }
            }),
            lounge: new Howl({
                src: ['../assets/sounds/music/Crowander-Klezmer.mp3'],
                html5: true,
                volume: MUSIC_STATUS.volume,
                mute: MUSIC_STATUS.mute,
                onfade: function () {
                    music.lounge.stop()
                    music.lounge.volume(MUSIC_STATUS.volume)
                },
                onplay: function () {
                    currentTrack = music.lounge
                }
            }),
            victory: new Howl({
                src: ['../assets/sounds/music/Crowander-American.mp3'],
                html5: true,
                volume: MUSIC_STATUS.volume,
                mute: MUSIC_STATUS.mute,
                onfade: function () {
                    music.victory.stop()
                    music.victory.volume(MUSIC_STATUS.volume)
                },
                onplay: function () {
                    currentTrack = music.victory
                }
            }),
        }

        sfx = {

            positive: new Howl({
                src: ['../assets/sounds/sfx/close.mp3'],
                volume: SFX_STATUS.volume,
                mute: SFX_STATUS.mute,
            }),
            join: new Howl({
                src: ['../assets/sounds/sfx/join.mp3'],
                volume: SFX_STATUS.volume,
                mute: SFX_STATUS.mute,
            }),
            expand: new Howl({
                src: ['../assets/sounds/sfx/expand.mp3'],
                volume: SFX_STATUS.volume,
                mute: SFX_STATUS.mute,
            }),
            minimize: new Howl({
                src: ['../assets/sounds/sfx/minimize.mp3'],
                volume: SFX_STATUS.volume,
                mute: SFX_STATUS.mute,
            }),
            error: new Howl({
                src: ['../assets/sounds/sfx/error.mp3'],
                volume: SFX_STATUS.volume,
                mute: SFX_STATUS.mute,
            }),
            timer: new Howl({
                src: ['../assets/sounds/sfx/clock.mp3'],
                volume: SFX_STATUS.volume,
                mute: SFX_STATUS.mute,
            }),
        }
        if (!userLocation) {
            music.welcome.play()
        } else if (userLocation === 'welcome') {
            music.welcome.play()
        } else if (userLocation === 'login') {
            music.welcome.play()
        } else if (userLocation === 'signup') {
            music.welcome.play()
        } else if (userLocation === 'menu') {
            music.menu.play()
        } else if (userLocation === 'lobby') {
            music.welcome.seek(54).play()
        } else if (userLocation === 'game') {
            music.lobby.play()
        }

        console.log(MUSIC_STATUS)

        const settingsMenu = document.querySelector('.settingsMenu')
        const settings_icon = document.querySelector('.settings_icon')

        const settings__nav = document.createElement('div')
        const settings__textBox = document.createElement('div')
        const settings__textVolume = document.createElement('div')
        const settings__musictext = document.createElement('div')
        const settings__sfxtext = document.createElement('div')

        const settings__musicMute = document.createElement('button')
        const settings__musicSlidecontainer = document.createElement('div')
        const settings__musicSlider = document.createElement('input')

        const settings__sfxMute = document.createElement('button')
        const settings__sfxSlidecontainer = document.createElement('div')
        const settings__sfxSlider = document.createElement('input')

        const exitgame__btn = document.createElement('a')

        settings__nav.classList.add('settingsMenu__nav')
        settings__textBox.classList.add('settingsMenu__textBox')
        settings__textVolume.classList.add('settingsMenu__textVolume')
        settings__musictext.classList.add('settingsMenu__text')
        settings__sfxtext.classList.add('settingsMenu__text')

        settings__musicMute.classList.add('btn', 'settingsMenu__muteToggle')
        if (!MUSIC_STATUS.mute) {
            settings__musicMute.innerHTML = '<i class="fas fa-volume-up"></i>'
        } else if (MUSIC_STATUS.mute === true) {
            settings__musicMute.classList.add('settingsMenu__muteToggle__off')
            settings__musicMute.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>'
        }

        settings__musicSlidecontainer.classList.add('settingsMenu__slidecontainer')
        settings__musicSlider.classList.add('settingsMenu__slidecontainer__slider')

        settings__musicSlider.type = 'range'
        settings__musicSlider.min = '0'
        settings__musicSlider.max = '100'
        settings__musicSlider.value = `${MUSIC_STATUS.volume * 100}`

        settings__musicSlider.oninput = function () {
            MUSIC_STATUS.volume = (+(this.value) / 100)
            for (const track in music) {
                music[track].volume(+(this.value) / 100)
            }
        }
        settings__sfxMute.classList.add('btn', 'settingsMenu__muteToggle')
        if (!SFX_STATUS.mute) {
            settings__sfxMute.innerHTML = '<i class="fas fa-volume-up"></i>'
        } else if (SFX_STATUS.mute === true) {
            settings__sfxMute.classList.add('settingsMenu__muteToggle__off')
            settings__sfxMute.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>'
        }

        settings__sfxSlidecontainer.classList.add('settingsMenu__slidecontainer')
        settings__sfxSlider.classList.add('settingsMenu__slidecontainer__slider')

        settings__sfxSlider.type = 'range'
        settings__sfxSlider.min = '0'
        settings__sfxSlider.max = '100'
        settings__sfxSlider.value = `${SFX_STATUS.volume * 100}`

        let hold = false

        function playSFX () {
            if (hold) {
                return
            } else {
                sfx.positive.play()
            }
            hold = true
            setTimeout(() => { hold = false }, 500)
        }

        settings__sfxSlider.oninput = function () {
            SFX_STATUS.volume = (+(this.value) / 100)
            for (const track in sfx) {
                sfx[track].volume(+(this.value) / 100)
            }
            playSFX()
        }

        exitgame__btn.classList.add('btn', 'btn--darkPurple', 'settingsMenu__btn')

        settings__textBox.innerText = "Settings"
        settings__textVolume.innerText = "Volume"
        settings__musictext.innerText = "Music"
        settings__sfxtext.innerText = "SFX"
        exitgame__btn.innerText = `EXIT GAME`

        settings__nav.appendChild(settings__textBox)
        settings__nav.appendChild(settings__textVolume)

        settings__musicSlidecontainer.appendChild(settings__musictext)
        settings__musicSlidecontainer.appendChild(settings__musicSlider)
        settings__musicSlidecontainer.appendChild(settings__musicMute)

        settings__sfxSlidecontainer.appendChild(settings__sfxtext)
        settings__sfxSlidecontainer.appendChild(settings__sfxSlider)
        settings__sfxSlidecontainer.appendChild(settings__sfxMute)

        settings__nav.appendChild(settings__musicSlidecontainer)
        settings__nav.appendChild(settings__sfxSlidecontainer)
        settings__nav.appendChild(exitgame__btn)

        settingsMenu.appendChild(settings__nav)

        function updateSound() {
            let sound_update = {
                music: MUSIC_STATUS,
                sfx: SFX_STATUS,
            }
            axios.post('/music/update', (sound_update))
                .then(res => {
                    MUSIC_STATUS = res.data.user_info.music_status
                    SFX_STATUS = res.data.user_info.sfx_status

                })
                .catch((error) => {
                    console.error('axios sound update broke', error)
                })
        }

        settings_icon.addEventListener('click', (event) => {
            event.preventDefault()
            sfx.positive.play()
            updateSound()
            settingsMenu.classList.toggle('hide')
        })

        function musicMuteEventHelper(event) {

            event.preventDefault()
            if (!MUSIC_STATUS.mute) {
                MUSIC_STATUS.mute = true
                console.log(currentTrack)
                for (const track in music) {
                    music[track].mute(true)
                }
                // currentTrack.mute(true)
                settings__musicMute.classList.toggle('settingsMenu__muteToggle__off')
                settings__musicMute.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>'
            } else if (MUSIC_STATUS.mute) {
                MUSIC_STATUS.mute = false
                for (const track in music) {
                    music[track].mute(false)
                }
                // currentTrack.mute(false)
                settings__musicMute.classList.toggle('settingsMenu__muteToggle__off')
                settings__musicMute.innerHTML = '<i class="fas fa-volume-up"></i>'
            }
            sfx.positive.play()

        }


        function sfxMuteEventHelper(event) {

            event.preventDefault()
            if (!SFX_STATUS.mute) {
                SFX_STATUS.mute = true
                for (const track in sfx) {
                    sfx[track].mute(true)
                }
                settings__sfxMute.classList.toggle('settingsMenu__muteToggle__off')
                settings__sfxMute.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>'
            } else if (SFX_STATUS.mute) {
                SFX_STATUS.mute = false
                for (const track in sfx) {
                    sfx[track].mute(false)
                }
                settings__sfxMute.classList.toggle('settingsMenu__muteToggle__off')
                settings__sfxMute.innerHTML = '<i class="fas fa-volume-up"></i>'
            }
            sfx.positive.play()
        }

        function exitGameEventHelper(event) {

            event.preventDefault()
            sfx.positive.play()
            updateSound()
            window.location.href = '/mainmenu/'
        }


        settings__musicMute.addEventListener('click', musicMuteEventHelper)

        settings__sfxMute.addEventListener('click', sfxMuteEventHelper)

        exitgame__btn.addEventListener('click', exitGameEventHelper)



    })
    .catch((error) => {
        console.error('axios get sound broke', error)
    })





