function checkNameInput(currentName){
  const name__input = document.querySelector('.profile__name-input')
  document.querySelector('.profile__name-change').classList.add('hide')


  setTimeout(() => {

    document.addEventListener('click', function nameUpdateTransition(event) {
      event.preventDefault()
      const withinBoundaries = event.composedPath().includes(name__input)
  
      const profile__name = document.createElement('div')
      profile__name.classList.add('profile__name')
      if(!withinBoundaries && !name__input.value){
        profile__name.innerText = `${currentName}`
        name__input.replaceWith(profile__name)
  
      } else if(name__input.value && !withinBoundaries || name__input.value && withinBoundaries){
        updateName(name__input.value)
        profile__name.innerText = `${name__input.value}`
        name__input.replaceWith(profile__name)
        
      } 
      profile__name.addEventListener('mouseenter', (event) => {
        event.preventDefault()
        document.querySelector('.profile__name-change').classList.remove('hide')
      })
    
      profile__name.addEventListener('mouseleave', (event) => {
        event.preventDefault()
        document.querySelector('.profile__name-change').classList.add('hide')
      })
    
      profile__name.addEventListener('click', function nameUpdate(event){
        event.preventDefault()
        console.log('name change mode')

        document.removeEventListener('click', this.nameUpdateTransition)
        const name__input = document.createElement('input')
        name__input.classList.add('profile__name-input')    
    
        const currentName = profile__name.innerText
    
        profile__name.replaceWith(name__input)
        checkNameInput(currentName)
    
      })

    })

  }, 1000)


}

function setAvatarList(currentAvatarName){
  const section__profile = document.querySelector('.section-profile')
  const profile__container = document.querySelector('.profile__container')
  const profile__backBtn = document.querySelector('.profile__backBtn')
  
  profile__container.innerHTML = ''
  profile__backBtn.remove()

  const available_avatar_names = ['default', 'bow', 'hat', 'sunglasses']

  const updateAvatar__header = document.createElement('div')
  const updateAvatar__listContainer = document.createElement('div')
  const updateAvatar__backBtn = document.createElement('a')

  updateAvatar__backBtn.classList.add('btn', 'btn__back', 'btn--darkPurple', 'updateAvatar__backBtn')
  profile__container.classList.add('profile__container--updateAvatar')
  updateAvatar__header.classList.add('updateAvatar__header')
  updateAvatar__listContainer.classList.add('updateAvatar__listContainer')

  updateAvatar__backBtn.addEventListener('click', goToProfile)
  updateAvatar__backBtn.innerHTML = `<span>&#8618;</span>`
  updateAvatar__header.innerText = 'Select Avatar'

  let counter = 1;
  for(let avatar_name of available_avatar_names){
    const avatar__container = document.createElement('div')
    const avatar__name = document.createElement('div')
    const avatar__img = document.createElement('img')

    if(avatar_name === currentAvatarName){
      avatar__img.classList.add('btn', 'updateAvatar__img', 'updateAvatar__img--green', `avatar-${counter}`)
    } else{
      avatar__img.classList.add('btn', 'updateAvatar__img', `avatar-${counter}`)
    }

    avatar__container.classList.add('updateAvatar__container')
    avatar__name.classList.add('updateAvatar__avatarName')

    avatar__name.innerText = `${avatar_name}`
    avatar__img.src = `assets/user-avatars/avatar_${avatar_name}.png`

    avatar__img.addEventListener('click', event => {
      event.preventDefault();
    
      let selected_avatar = event.target.classList[2]
      let new_avatar_id = selected_avatar.slice(-1);

      document.querySelectorAll('.updateAvatar__img').forEach((avatar) => {
        if(avatar.classList.contains(`avatar-${new_avatar_id}`)){
          avatar.classList.add('updateAvatar__img--green')
        } else{
          avatar.classList.remove('updateAvatar__img--green')
        }
      })

      updateAvatar(+new_avatar_id)
    })

    avatar__container.append(avatar__name, avatar__img)
    updateAvatar__listContainer.appendChild(avatar__container)

    counter++

  }

  updateAvatar__backBtn.addEventListener('click', goToProfile)

  profile__container.append(updateAvatar__header, updateAvatar__listContainer)
  section__profile.appendChild(updateAvatar__backBtn)


}

function setProfile(data) {

  const userInfo = data.userInfo
  const userAchievements = data.achievements

  const section__menu = document.querySelector('.section-menu')
  const section__profile = document.querySelector('.section-profile')
  const updateAvatar__section = document.querySelector('.profile__container--updateAvatar')
 
  if(updateAvatar__section){
    const updateAvatar__backBtn = document.querySelector('.updateAvatar__backBtn')
    updateAvatar__section.remove()
    updateAvatar__backBtn.remove()
  }

  const profile__back_btn = document.createElement('a')
  const profile__container = document.createElement('div')
  const profile__container_left = document.createElement('div')
  const profile__container_right = document.createElement('div')
  const profile__container_rightTop = document.createElement('div')
  const profile__container_rightBottom = document.createElement('div')
  const profile__avatarContainer = document.createElement('div')
  const profile__avatar = document.createElement('img')
  const profile__avatar_change = document.createElement('div')
  const profile__name = document.createElement('div')
  const profile__name_change = document.createElement('div') 

  const achievements__header = document.createElement('div')
  const achievement__container = document.createElement('div')

  profile__back_btn.classList.add('btn', 'btn__back', 'btn--darkPurple', 'profile__backBtn')
  profile__container.classList.add('profile__container')
  profile__container_left.classList.add('profile__container--left')
  profile__container_right.classList.add('profile__container--right')
  profile__container_rightTop.classList.add('profile__container--right-top')
  profile__container_rightBottom.classList.add('profile__container--right-bottom')
  profile__avatarContainer.classList.add('profile__avatarContainer')
  profile__avatar.classList.add('profile__avatar')
  profile__avatar_change.classList.add('btn', 'profile__avatar-change', 'hide')
  profile__name.classList.add('profile__name')
  profile__name_change.classList.add('profile__name-change', 'hide') 

  achievements__header.classList.add('achievement__header')
  achievement__container.classList.add('achievement__container')
  
  profile__back_btn.addEventListener('click', (event) => {
    profile__container.remove()
    profile__back_btn.remove()
    section__profile.classList.add("hide")
    section__menu.classList.remove('hide')
  })

  profile__back_btn.innerHTML = `<span>&#8618;</span>`
  profile__avatar.src = `assets/user-avatars/avatar_${userInfo.avatar_name}.png`
  profile__avatar_change.innerHTML = `&#9998;`
  profile__name.innerText = `${userInfo.user_name}`
  profile__name_change.innerHTML = `&#9998; <span> Edit </span>`

  achievements__header.innerText = `Achievements`

  for (let achievement of userAchievements) {

    const achievement__imgContainer = document.createElement('div')
    const achievement__img = document.createElement('img')

    achievement__imgContainer.classList.add('achievement__imgContainer')
    achievement__img.classList.add('achievement__img')

    achievement__img.src = `assets/character-icon/${achievement.achievement_name}.png`

    achievement__imgContainer.appendChild(achievement__img)
    achievement__container.appendChild(achievement__imgContainer)

  }

  profile__avatarContainer.addEventListener('mouseenter', (event) => {
    event.preventDefault()
    profile__avatar_change.classList.remove('hide')
  })

  profile__avatarContainer.addEventListener('mouseleave', (event) => {
    event.preventDefault()
    profile__avatar_change.classList.add('hide')
  })


  profile__avatar_change.addEventListener('click', (event) => {
    event.preventDefault()
    if(!profile__avatar_change.classList.contains('hide')){
       setAvatarList(userInfo.avatar_name)
    }
  })

  profile__name.addEventListener('mouseenter', (event) => {
    event.preventDefault()
    document.querySelector('.profile__name-change').classList.remove('hide')
  })

  profile__name.addEventListener('mouseleave', (event) => {
    event.preventDefault()
    document.querySelector('.profile__name-change').classList.add('hide')
  })

  profile__name.addEventListener('click', function nameUpdate(event){
    event.preventDefault()
    console.log('name change mode')

    const name__input = document.createElement('input')
    name__input.classList.add('profile__name-input')

    const currentName = profile__name.innerText

    profile__name.replaceWith(name__input)
    
    checkNameInput(currentName)

  })


  profile__avatarContainer.append(profile__avatar_change, profile__avatar)
  profile__container_left.appendChild(profile__avatarContainer)

  profile__container_rightTop.append(profile__name, profile__name_change)
  profile__container_rightBottom.append(achievements__header, achievement__container)
  profile__container_right.append(profile__container_rightTop, profile__container_rightBottom)

  profile__container.append(profile__container_left, profile__container_right)
  section__profile.append(profile__back_btn, profile__container)

  // section__profile.appendChild(profile__mainContainer)

  section__menu.classList.add('hide')
  section__profile.classList.remove('hide')

}

function goToProfile(){
  axios.post('/mainmenu/profile')
    .then(res => {
      // Array with UP TO 6 achievement objects
      // No achievements results in an empty array
      // achievements: [ { achievement_id: 1, achievement_name: 'achieveNerdyBoy' }, {} ]
      // userInfo: {avatar_name: "sunglasses", user_id: 24, user_name: "chicken"}
      console.log('axios.then', res.data.userData)
      const data = res.data.userData
      setProfile(data)

    })
    .catch((err) => {
      alert('I dont feel so good')
      console.error("ERROR", err)
    })
}

function updateAvatar(avatar_id){
  axios.post('/mainmenu/avatar', { avatar_id })
    .then(res => {

      // Object containing user avatar info
      // { avatar_id: 3, avatar_name: 'bow' }
      console.log('update Avatar axios.then', res.data)

    })
    .catch((err) => {
      alert('I dont feel so good')
      console.error('ERROR', err)
    })
}


function updateName(newUsername){
  axios.post('/mainmenu/username', { newUsername })
    .then(res => {

      // Object containing new user name
      // { user_name: 'Chewbacca' }
      // console.log('UPDATE NAME axios.then', res.data)
      console.log("Update name success")

    })
    .catch((err) => {
      alert('I dont feel so good')
      console.error("ERROR", err)
    })
}



document.querySelector('.profile_icon').addEventListener('click', event => {
  event.preventDefault();
  goToProfile()
})
