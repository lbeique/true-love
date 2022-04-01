
const socket = io.connect();


// ERROR

socket.on('error', function (err) {
    console.log('received socket error:', err);
})

// JOIN

socket.on('join', (users) => {

    const section_player = document.getElementsByClassName("section-players")[0];

    const userPropertiesArr = Object.values(users);
    section_player.innerHTML = ""; // stop it from appending

    for (let userProperty of userPropertiesArr) {
        section_player.innerHTML += '<p>' + userProperty.avatar + '</p>';
    }
})



// LEAVE

socket.on('leave', (users) => {

    const section_player = document.getElementsByClassName("section-players")[0];

    const userPropertiesArr = Object.values(users);
    section_player.innerHTML = ""; // stop it from appending

    for (let userProperty of userPropertiesArr) {
        section_player.innerHTML += '<p>' + userProperty.avatar + '</p>';
    }
})









