let socketUsers = {}; // wanna use Database instead later - maybe??
let lobbyRooms = {};

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
        roomId: null // Foreign Key for DB ?
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
            game_active: false,
            clients: {}
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


module.exports = {
    handleServerJoin,
    handleServerDisconnect,
    handleGetAllUsers,
    handleGetUserFromClientId,
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
    handleDeleteLobby
}
