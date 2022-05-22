function apples(userData) {
  console.log('user_name', userData.userInfo.user_name)

}

document.querySelector('.profile_icon').addEventListener('click', event => {
  event.preventDefault();
  axios.post('/mainmenu/profile')
    .then(res => {

      // Array with UP TO 6 achievement objects
      // No achievements results in an empty array
      // [ { achievement_id: 1, achievement_name: 'achieveNerdyBoy' } ]
      console.log('axios.then', res.data.userData)
      let userData = res.data.userData
     
      apples(userData)
      // DOM MANIPULATION HERE


    })
    .catch(() => {
      // alert('Uh oh')
    })
})


document.querySelector('.leaderboard_icon').addEventListener('click', event => {
  event.preventDefault();

  // Need to give axios the user's chosen new avatar id
  // TEMPORARY JUST TO TEST
  let avatar_id = 3


  axios.post('/mainmenu/avatar', { avatar_id })
    .then(res => {

      // Object containing user avatar info
      // { avatar_id: 3, avatar_name: 'bow' }
      console.log('axios.then', res.data)

      // DOM MANIPULATION HERE


    })
    .catch(() => {
      // alert('Uh oh')
    })
})


document.querySelector('.username_form').addEventListener('click', event => {
  event.preventDefault();

  // THESE ARE JUST TEMPORARY NAMES
  // let newUsername = document.querySelector('.username_input').value
  let newUsername = "Chewbacca"

  axios.post('/mainmenu/username', { newUsername })
    .then(res => {

      // Object containing new user name
      // { user_name: 'Chewbacca' }
      console.log('axios.then', res.data)

      // DOM MANIPULATION HERE


    })
    .catch(() => {
      // alert('Uh oh')
    })
})