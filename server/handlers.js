let socketUsers = {}; // wanna use Database instead later - maybe??
let lobbyRooms = {};

let crushes = [
    {
        id: 1,
        name: 'Nerdman Enerd',
        nickname: 'nerdyBoy',
        description: '20' // 20 for mythology - this is for the trivia api categorizing
    },
    {
        id: 2,
        name: 'Emoman Elmo',
        nickname: 'emoBoy',
        description: '20'
    },
    {
        id: 3,
        name: 'Sportman Bill',
        nickname: 'sportyBoy',
        description: '20'
    },
    {
        id: 4,
        name: 'Nerdwoman Enerdy',
        nickname: 'nerdyGirl',
        description: '20'
    },
    {
        id: 5,
        name: 'Emowoman Elmody',
        nickname: 'emoGirl',
        description: '20'
    },
    {
        id: 6,
        name: 'Sportwoman Billie',
        nickname: 'sportyGirl',
        description: '20'
    }
]


const randomWords = require('random-words');


// Server Handlers

function handleServerJoin(client, user_id, user_name) {

    const randomAvatars = [`🧋`, `☕️`, `💩`, `💃`, `🦊`, `🦄`];

    const avatarIndex = Math.floor(Math.random() * randomAvatars.length);

    const user = {
        socketId: client.id,
        username: user_name,
        userId: user_id,
        avatar: randomAvatars[avatarIndex],
        roomId: null, // Foreign Key for DB ?
        game: {
            crushVote: null
        }
    };

    socketUsers[client.id] = user;

    // socket.join("gameRoom");
    // console.log(`${socket.id} is now in the room`);

    // const clients = io.in('gameRoom').allSockets(); // RETURNS PROMISE
    // console.log('CLIENTS', clients);

    console.log(`${user.socketId} has joined the server`);
    return socketUsers[client.id]

}

function handleGetAllUsers() {
    return socketUsers
}

function handleGetUserFromClientId(client) {
    return socketUsers[client.id]
}

function handleServerDisconnect(client) {
    console.log(`${client.id} has been disconnected from the server`);
    delete socketUsers[client.id];
    return
}




// LOBBY HANDLER FUNCTIONS

function makeCode(length) {
    let code = ""
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (let i = 0; i < length; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return code
}

function handleCreateLobby(roomId, roomName, roomCode, user_info) {

    if (!lobbyRooms[roomId]) {
        let lobby = {
            creator_id: user_info.user_id,
            creator_name: user_info.user_name,
            room_name: roomName,
            room_id: roomId,
            room_code: roomCode,
            num_clientInRoom: 0,
            clients: {},
            gameState: {
                game_active: false,
                topVotedCrush: {},
                gameStages: [],
                currentStage: null,
                timer: null,
                votes: [],
                voteResult: null,
            }
        }
        lobbyRooms[roomId] = lobby
        return lobbyRooms[roomId]
    }
    return
}

function handleGetAllLobbies() {
    return lobbyRooms
}

function handleGetLobbyFromId(roomId) {
    return lobbyRooms[roomId]
}

function handleGetLobbyFromCode(roomCode) {
    for (const lobby in lobbyRooms) {
        if (lobbyRooms[lobby].room_code === roomCode) {
            console.log('get lobby from code lobbyRooms[lobby]', lobbyRooms[lobby])
            return lobbyRooms[lobby]
        }
    }
    return
}

function handleLobbyJoin(roomId, client) {
    console.log('handle lobby join room Id', roomId)

    socketUsers[client.id].roomId = roomId
    console.log(socketUsers[client.id])

    const connectedClient = socketUsers[client.id]
    lobbyRooms[roomId].clients[connectedClient.socketId] = connectedClient

    console.log('handle lobby join room', lobbyRooms[roomId])
    return lobbyRooms[roomId]
}

function handleDeleteLobby(roomId) {
    for (const client in socketUsers) {
        if (socketUsers[client].roomId === roomId) {
            socketUsers[client].roomId = null
        }
    }
    delete lobbyRooms[roomId]
    return
}

function handleLobbyDisconnect(roomId, client) {
    socketUsers[client.id].roomId = null
    const connectedClient = socketUsers[client.id]
    delete lobbyRooms[roomId].clients[connectedClient.socketId]
    console.log(lobbyRooms[roomId].clients)
    if (Object.keys(lobbyRooms[roomId].clients).length === 0) {
        handleDeleteLobby(roomId)
    }
    return
}

function handleGetLobbyPlayers(roomId) {
    return lobbyRooms[roomId].clients
}


// GAME STATE HANDLER
function handleGameState(room){
    room.gameState.game_active = true
    room.num_clientInRoom = Object.keys(room.clients).length

    console.log("UPDATED GAME STATE", room)

    return 
}


// CRUSHES
function handleCrushes(room){
    const crushesClone = [...crushes] // copy
    const randomizedCrushes = []

    while(randomizedCrushes.length !== 3){
        const randomIndex = Math.floor(Math.random()* crushesClone.length)
        const selectedCrush = crushesClone[randomIndex]
        crushesClone.splice(randomIndex, 1) // remove so there will be no duplicates served to the players

        randomizedCrushes.push(selectedCrush)
    }

    room.randomizedCrushes = randomizedCrushes

    return room.randomizedCrushes
    
}

function handleVote(votedCrush, client, room){

    console.log("PASSED CLIENT", client)
 
    client.game.crushVote = votedCrush.id // !! saves to socketUser -- not saving - come back to this
    room.gameState.votes.push(votedCrush.id)

    console.log('gameStateVotes track', room.gameState.votes) // basically trackVoteArr

    if(room.gameState.votes.length === room.num_clientInRoom){
        const resultCalculation = {}
        let mostVotedCrushId = 0;
        let highestVotes = 0;
        let topPicks = []

        for (const votedID of room.gameState.votes) {
            if (resultCalculation[votedID]) {
                resultCalculation[votedID] += 1;
            } else {
                resultCalculation[votedID] = 1;
            }

        }

        console.log("RESULT CALCULATION", resultCalculation)

        for (let result in resultCalculation){
            if (resultCalculation[result] >= highestVotes) {
                highestVotes = resultCalculation[result]
            }
        }

        for (const result in resultCalculation) {
            if (resultCalculation[result] === highestVotes) {
                topPicks.push(result)
            }
        }

        if (topPicks.length > 1) {
            mostVotedCrushId = topPicks[Math.floor(Math.random() * topPicks.length)]
        } else {
            mostVotedCrushId = topPicks[0]
        }

        const gameState = room.gameState

        console.log('VOTED CRUSH ID', mostVotedCrushId)
        
        gameState.topVotedCrush = crushes.filter(crush => crush.id === +mostVotedCrushId)[0]

        console.log('Vtop', gameState.topVotedCrush)

        const data = {
            topVotedCrush:  gameState.topVotedCrush,
            clientId: client.userId
        }

        return data // returns an object

    } else {

        return client.userId // returns a string

    }

}



// TRIVIA HANDLERS

function handleTrivia(client, trivias) {
    const connectedClient = socketUsers[client.id]

    let answers;
    for (let trivia of trivias) {

        answers = [...trivia.incorrect_answers]
        answers.push(trivia.correct_answer)
        answers.sort(() => 0.5 - Math.random()) // shuffle the multiple choices
        trivia.shuffledAnswers = answers
        trivia.animated = 0
    }

    connectedClient.triviaQuestions = trivias
    connectedClient.triviaProgressIndex = 0
    connectedClient.triviaPts = 0

    return connectedClient.triviaQuestions[connectedClient.triviaProgressIndex]
}

function nextTrivia(client) {
    const connectedClient = socketUsers[client.id]
    const questions = connectedClient.triviaQuestions
    const index = connectedClient.triviaProgressIndex

    const trivia = questions[index]

    return trivia
}

function checkTriviaAnswer(client, correct_answer, userAnswer) {
    const connectedClient = socketUsers[client.id]
    const currentTrivia = connectedClient.triviaQuestions[connectedClient.triviaProgressIndex]


    if (userAnswer !== correct_answer) {
        currentTrivia.animated = 1
        const data = {
            points: connectedClient.triviaPts,
            result: false
        }
        return data
    } else {
        connectedClient.triviaPts++
        connectedClient.triviaProgressIndex++
        const data = {
            points: connectedClient.triviaPts,
            result: true
        }
        return data
    }
}

// word scrambler

function getWords(client){

    const connectedClient = socketUsers[client.id]
    connectedClient.listOfWords = {} 

    return randomWords({ exactly: 10, maxLength: 5 }) 

}

// Victory

function handleGetVictory(players) {
    let topPlayerPoints = 0
    let topPlayers = []
    let winningPlayer = null
    for (const player in players) {
        if (players[player].triviaPts >= topPlayerPoints) {
            topPlayerPoints = players[player].triviaPts
        }
    }

    for (const player in players) {
        if (players[player].triviaPts === topPlayerPoints) {
            topPlayers.push(players[player])
        }
    }

    console.log(players)

    if (topPlayers.length > 1) {
        winningPlayer = topPlayers[Math.floor(Math.random() * topPlayers.length)]
    } else {
        winningPlayer = topPlayers[0]
    }
    console.log('winning player', winningPlayer)
    return winningPlayer
}


module.exports = {
    handleServerJoin,
    handleServerDisconnect,
    handleGetAllUsers,
    handleGetUserFromClientId,

    handleGameState,

    handleCrushes,
    handleVote,

    handleTrivia,
    checkTriviaAnswer,
    nextTrivia,

    makeCode,
    handleCreateLobby,
    handleGetAllLobbies,
    handleGetLobbyFromId,
    handleGetLobbyFromCode,
    handleLobbyJoin,
    handleLobbyDisconnect,
    handleDeleteLobby,
    handleGetLobbyPlayers,

    handleGetVictory
}
