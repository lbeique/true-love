// we can put the .global_standings on the leaderboard button or icon

document.querySelector('.global_standings').addEventListener('click', event => {
    event.preventDefault();
    axios.post('/leaderboard/global/standings')
        .then(res => {

            // Check DB Access for object ( getGlobalLeaderboard )
            console.log('axios.then', res.data.globalLeaderboardData)

            // DOM MANIPULATION HERE

            let user = res.data.globalLeaderboardData.userInfo

            let globalLeaderboard = res.data.globalLeaderboardData.globalLeaderboard

            globalLeaderboard.forEach(userStanding => {
                let user_container = document.createElement('div')
                user_container.id = userStanding.user_id
            });


        })
        .catch(() => {
            // alert('Uh oh')
        })
})


document.querySelector('.global_history').addEventListener('click', event => {
    event.preventDefault();


    axios.post('/leaderboard/global/history')
        .then(res => {

            // Check DB Access for object ( getGlobalMatchHistory )
            console.log('axios.then', res.data.globalHistoryData)

            // DOM MANIPULATION HERE

            let user = res.data.globalHistoryData.userInfo

            let globalMatchHistory = res.data.globalHistoryData.globalMatchHistory

            globalMatchHistory.forEach(match => {
                let match_container = document.createElement('div')
                match_container.id = match.room_id
            });


        })
        .catch(() => {
            // alert('Uh oh')
        })
})


document.querySelector('.user_history').addEventListener('click', event => {
    event.preventDefault();


    axios.post('/leaderboard/history')
        .then(res => {

            // Check DB Access for object ( getUserMatchHistory )
            console.log('axios.then', res.data.userHistoryData)

            // DOM MANIPULATION HERE

            let user = res.data.userHistoryData.userInfo

            let userMatchHistory = res.data.userHistoryData.userMatchHistory

            userMatchHistory.forEach(userMatch => {
                let match_container = document.createElement('div')
                match_container.id = userMatch.room_id
            });




        })
        .catch(() => {
            // alert('Uh oh')
        })
})



document.querySelector('.leaderboard_container').addEventListener('click', event => {
    event.preventDefault();
    if (event.target?.id) {
        let roomId = event.target.id
        axios.post('/leaderboard/match', (roomId))
            .then(res => {

                // Check DB Access for object ( getRoomInformationByRoomId )
                console.log('axios.then', res.data.roomData)

                // DOM MANIPULATION HERE

                let user = res.data.roomData.userInfo

                let roomUsers = res.data.roomData.roomUsers

                roomUsers.forEach(roomUser => {
                    let user_container = document.createElement('div')
                    user_container.id = roomUser.user_id
                });


            })
            .catch(() => {
                // alert('Uh oh')
            })
    }
})