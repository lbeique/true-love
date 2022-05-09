const fetch = require('node-fetch')

let socketUsers = {}; // wanna use Database instead later - maybe??
let lobbyRooms = {};

let crushes = [
    {
        id: 1,
        name: 'Rocco Moses',
        nickname: 'nerdyBoy',
        categoryEasy: { id: '18', name: 'Computer Science' },
        categoryMedium: null,
        categoryHard: null,
    },
    {
        id: 2,
        name: 'Julien Raven',
        nickname: 'emoBoy',
        categoryEasy: { id: '23', name: 'History' },
        categoryMedium: null,
        categoryHard: null,
    },
    {
        id: 3,
        name: 'Chadwick "The Chad" Jonhson',
        nickname: 'sportyBoy',
        categoryEasy: { id: '11', name: 'Film' },
        categoryMedium: null,
        categoryHard: null,
    },
    {
        id: 4,
        name: 'Willow Whitlock',
        nickname: 'nerdyGirl',
        categoryEasy: { id: '9', name: 'General Knowledge' },
        categoryMedium: null,
        categoryHard: null,
    },
    {
        id: 5,
        name: 'Faye Midnight',
        nickname: 'emoGirl',
        categoryEasy: { id: '15', name: 'Video Games' },
        categoryMedium: null,
        categoryHard: null,
    },
    {
        id: 6,
        name: 'Billie Hale',
        nickname: 'sportyGirl',
        categoryEasy: { id: '21', name: 'Sports' },
        categoryMedium: null,
        categoryHard: null,
    }
]

let categories = [ // easy // medium // hard
    {
        id: '9', // 116 // 123 // 59
        name: 'General Knowledge'
    },
    {
        id: '11', // 87 // 116 // 42
        name: 'Film'
    },
    {
        id: '15', // 322 // 441 // 182
        name: 'Video Games'
    },
    {
        id: '18', // 48 // 74 // 37
        name: 'Computer Science'
    },
    {
        id: '21', // 49 // 64 // 20
        name: 'Sports'
    },
    {
        id: '23', // 66 // 161 // 80
        name: 'History'
    },
    {
        id: '17', // 59 // 100 // 68
        name: 'Nature Science'
    },
    {
        id: '10', // 31 // 40 // 26
        name: 'Literature'
    },
    {
        id: '12', // 107 // 189 // 68
        name: 'Music'
    },
    {
        id: '14', // 69 // 72 // 29
        name: 'Television'
    },
    {
        id: '22', // 80 // 139 // 56
        name: 'Geography'
    },
    {
        id: '31', // 59 // 82 // 43
        name: 'Anime Manga'
    },
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
            crushVote: null,
            trivia: {
                easy: {
                    questions: [],
                    errors: [],
                    progressIndex: 0,
                    points: 0,
                },
                medium: {
                    questions: [],
                    errors: [],
                    progressIndex: 0,
                    points: 0,
                },
                hard: {
                    questions: [],
                    errors: [],
                    progressIndex: 0,
                    points: 0,
                }
            },
            finalPoints: 0,
            finalPosition: null,
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

function handleGetUserFromUserId(userId) {
    for (const user in socketUsers) {
        if (socketUsers[user].userId === userId) {
            return socketUsers[user]
        }
    }
    return
}

function handleServerDisconnect(client) {
    console.log(`${client.id} has been disconnected from the server`);
    delete socketUsers[client.id];
    return
}

// API FETCH TOKEN
async function fetchTriviaToken() {
    const response = await fetch(`https://opentdb.com/api_token.php?command=request`)
    const data = await response.json()
    return data.token
}


// LOBBY HANDLER FUNCTIONS
async function handleCreateLobby(roomId, roomName, roomCode, user_info) {

    if (!lobbyRooms[roomId]) {
        let lobby = {
            creator_id: user_info.user_id,
            creator_name: user_info.user_name,
            num_clientInRoom: 0,
            room_code: roomCode,
            room_id: roomId,
            room_name: roomName,
            token: await fetchTriviaToken(),
            clients: {},
            gameState: {
                game_active: false,
                triviaIndex: 0,
                randomizedCrushes: [],
                topVotedCrush: {},
                votes: [],
                triviaGames: {
                    easyClient: [],
                    easyAnswers: [],

                    mediumClient: [],
                    mediumAnswers: [],

                    hardClient: [],
                    hardAnswers: [],
                },
                leaderboard: []
            },
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
    lobbyRooms[roomId].num_clientInRoom++
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

// Should now transfer host if host leaves
function handleLobbyDisconnect(roomId, client) {
    socketUsers[client.id].roomId = null
    const connectedClient = socketUsers[client.id]
    if (connectedClient.userId === lobbyRooms[roomId].creator_id && Object.keys(lobbyRooms[roomId].clients).length >= 1) {
        delete lobbyRooms[roomId].clients[connectedClient.socketId]
        lobbyRooms[roomId].creator_id = Object.values(lobbyRooms[roomId].clients)[0].userId
        lobbyRooms[roomId].creator_name = Object.values(lobbyRooms[roomId].clients)[0].userName
    } else {
        delete lobbyRooms[roomId].clients[connectedClient.socketId]
    }
    lobbyRooms[roomId].num_clientInRoom--
    console.log(lobbyRooms[roomId].clients)
    if (Object.keys(lobbyRooms[roomId].clients).length === 0) {
        handleDeleteLobby(roomId)
    }
    return
}

function handleGetLobbyPlayers(roomId) {
    return lobbyRooms[roomId].clients
}


// GAME STATE ACTIVE HANDLER
function handleGameState(room) {
    room.gameState.game_active = true
    console.log("UPDATED GAME STATE", room)
    return
}


// CRUSHES
function handleCrushes(room) {
    const crushesClone = [...crushes] // copy
    const categoriesClone = [...categories]
    const randomizedCrushes = []

    while (randomizedCrushes.length !== 3) {
        const randomCrushIndex = Math.floor(Math.random() * crushesClone.length)
        const selectedCrush = crushesClone[randomCrushIndex]
        crushesClone.splice(randomCrushIndex, 1) // remove so there will be no duplicates served to the players

        let randomCategoryIndex = Math.floor(Math.random() * categoriesClone.length)
        selectedCrush.categoryMedium = categoriesClone[randomCategoryIndex]
        categoriesClone.splice(randomCategoryIndex, 1)

        randomCategoryIndex = Math.floor(Math.random() * categoriesClone.length)
        selectedCrush.categoryHard = categoriesClone[randomCategoryIndex]
        categoriesClone.splice(randomCategoryIndex, 1)

        randomizedCrushes.push(selectedCrush)
    }

    room.gameState.randomizedCrushes = randomizedCrushes

    // Limiting the crush object sent back to client
    const clientCrushes = []

    randomizedCrushes.forEach(crush => {
        clientCrushes.push({ id: crush.id, name: crush.name, nickname: crush.nickname, categoryEasy: crush.categoryEasy.name, categoryMedium: crush.categoryMedium.name })
    });

    return clientCrushes

}

function handleGetCrushFromId(crushId) {
    for (const crush of crushes) {
        if (crush.id === crushId) {
            console.log('crush', crush)
            return crush
        }
    }
}

function handleVote(votedCrush, client, room) {

    console.log("PASSED CLIENT", client)

    client.game.crushVote = votedCrush.id

    room.gameState.votes.push(votedCrush.id)

    console.log('gameStateVotes track', room.gameState.votes) // basically trackVoteArr


    // This will need to change slightly, add a check to make sure everyone present in lobby has voted as well - Laurent
    if (room.gameState.votes.length === room.num_clientInRoom) {
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

        for (let result in resultCalculation) {
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
            topVotedCrush: gameState.topVotedCrush,
            clientId: client.userId
        }

        return data // returns an object

    } else {

        return client.userId // returns a string

    }

}


// TRIVIA
// client.on('trivia_question', (triviasArr) => {
//     io.to(client.id).emit('trivia_start', handlers.handleTrivia(client, triviasArr))
//   })

//   client.on('trivia_check_answer', (data) => {
//     io.to(client.id).emit('trivia_reset_state', handlers.checkTriviaAnswer(client, data.correct_answer, data.userAnswer))
//   })

//   client.on('trivia_next_question', () => {
//     io.to(client.id).emit('trivia_start', handlers.nextTrivia(client))
//   })


// TRIVIA HANDLERS

function handleTrivia(trivias, room) {

    // NOTE FOR LAURENT ----

    // LAST THING YOU DID WAS CALL API

    // DONT NEED CLIENT INFO HERE, (maybe)

    // STORE THE TRIVIA ANSWERS IN A BETTER WAY!

    // START HERE!!!!!!!!!!!!!!!!!!!!!

    console.log('trivia', trivias, trivias.length)

    for (let i = trivias.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [trivias[i], trivias[j]] = [trivias[j], trivias[i]];
    }


    let clientTriviaQuestions = []
    let correctTriviaAnswers = []
    for (let i = 0; i < trivias.length; i++) {
        let shuffledAnswers = []
        let triviaQuestion = {}
        shuffledAnswers = [...trivias[i].incorrect_answers]
        shuffledAnswers.push(trivias[i].correct_answer)
        shuffledAnswers.sort(() => 0.5 - Math.random()) // shuffle the multiple choices
        triviaQuestion.difficulty = trivias[i].difficulty
        triviaQuestion.category = trivias[i].category
        triviaQuestion.shuffledAnswers = shuffledAnswers
        triviaQuestion.animated = 0
        triviaQuestion.index = i
        triviaQuestion.question = trivias[i].question

        clientTriviaQuestions.push(triviaQuestion)
        correctTriviaAnswers.push(trivias[i].correct_answer)
        // trivias[i].shuffledAnswers = answers
        // trivias[i].animated = 0
        // trivias[i].index = i
    }
    // for (let trivia of trivias) {
    //     answers = [...trivia.incorrect_answers]
    //     answers.push(trivia.correct_answer)
    //     answers.sort(() => 0.5 - Math.random()) // shuffle the multiple choices
    //     trivia.shuffledAnswers = answers
    //     trivia.animated = 0
    // }

    if (room.gameState.triviaIndex === 0) {
        room.gameState.triviaGames.easyClient.push(clientTriviaQuestions)
        room.gameState.triviaGames.easyAnswers.push(correctTriviaAnswers)
        // user.game.trivia.easy.questions.push(clientTriviaQuestions[0])
        // user.game.trivia.easy.progressIndex = 0
        // user.game.trivia.easy.points = 0
        // user.game.trivia.easy.errors.push(0)
    } else if (room.gameState.triviaIndex === 1) {
        room.gameState.triviaGames.mediumClient.push(clientTriviaQuestions)
        room.gameState.triviaGames.mediumAnswers.push(correctTriviaAnswers)
        // user.game.trivia.medium.questions.push(clientTriviaQuestions[0])
        // user.game.trivia.medium.progressIndex = 0
        // user.game.trivia.medium.points = 0
        // user.game.trivia.medium.errors.push(0)
    } else if (room.gameState.triviaIndex === 2) {
        room.gameState.triviaGames.hardClient.push(clientTriviaQuestions)
        room.gameState.triviaGames.hardAnswers.push(correctTriviaAnswers)
        // user.game.trivia.hard.questions.push(clientTriviaQuestions[0])
        // user.game.trivia.hard.progressIndex = 0
        // user.game.trivia.hard.points = 0
        // user.game.trivia.hard.errors.push(0)
    }

    return clientTriviaQuestions

    // connectedClient.triviaQuestions = trivias
    // connectedClient.triviaProgressIndex = 0
    // connectedClient.triviaPts = 0

    // return connectedClient.triviaQuestions[connectedClient.triviaProgressIndex]
}

function handleUserTriviaStart(room, clientTriviaQuestions) {
    let clients = room.clients
    if (room.gameState.triviaIndex === 0) {
        for (const triviaQuestion of clientTriviaQuestions) {
            for (const client in clients) {
                clients[client].game.trivia.easy.questions.push(triviaQuestion)
                clients[client].game.trivia.easy.errors.push(0)
            }
        }
    } else if (room.gameState.triviaIndex === 1) {
        for (const triviaQuestion of clientTriviaQuestions) {
            for (const client in clients) {
                clients[client].game.trivia.medium.questions.push(triviaQuestion)
                clients[client].game.trivia.medium.errors.push(0)
            }
        }
    } else if (room.gameState.triviaIndex === 2) {
        for (const triviaQuestion of clientTriviaQuestions) {
            for (const client in clients) {
                clients[client].game.trivia.hard.questions.push(triviaQuestion)
                clients[client].game.trivia.hard.errors.push(0)
            }
        }
    }
}

function nextTrivia(user, room) {

    let userProgressIndex = null
    let nextTrivia = null
    let errors = null

    if (room.gameState.triviaIndex === 0) {
        userProgressIndex = user.game.trivia.easy.progressIndex
        nextTrivia = user.game.trivia.easy.questions[userProgressIndex]
        errors = user.game.trivia.easy.errors[userProgressIndex]
    } else if (room.gameState.triviaIndex === 1) {
        userProgressIndex = user.game.trivia.medium.progressIndex
        nextTrivia = user.game.trivia.medium.questions[userProgressIndex]
        errors = user.game.trivia.medium.errors[userProgressIndex]
    } else if (room.gameState.triviaIndex === 2) {
        userProgressIndex = user.game.trivia.hard.progressIndex
        nextTrivia = user.game.trivia.hard.questions[userProgressIndex]
        errors = user.game.trivia.hard.errors[userProgressIndex]
    }

    return { nextTrivia, errors }
}

function checkTriviaAnswer(user, room, answer) {


    let userProgressIndex = null
    let currentTrivia = null
    let errors = null
    let points = null

    if (room.gameState.triviaIndex === 0) {
        userProgressIndex = user.game.trivia.easy.progressIndex
        points = user.game.trivia.easy.points
        correctAnswer = room.gameState.triviaGames.easyAnswers[userProgressIndex]
        currentTrivia = user.game.trivia.easy.questions[userProgressIndex]
        errors = user.game.trivia.easy.errors[userProgressIndex]
    } else if (room.gameState.triviaIndex === 1) {
        userProgressIndex = user.game.trivia.medium.progressIndex
        points = user.game.trivia.medium.points
        correctAnswer = room.gameState.triviaGames.mediumAnswers[userProgressIndex]
        currentTrivia = user.game.trivia.medium.questions[userProgressIndex]
        errors = user.game.trivia.medium.errors[userProgressIndex]
    } else if (room.gameState.triviaIndex === 2) {
        userProgressIndex = user.game.trivia.hard.progressIndex
        points = user.game.trivia.hard.points
        correctAnswer = room.gameState.triviaGames.hardAnswers[userProgressIndex]
        currentTrivia = user.game.trivia.hard.questions[userProgressIndex]
        errors = user.game.trivia.hard.errors[userProgressIndex]
    }


    if (answer !== correctAnswer) {
        errors++
        const data = {
            points: points,
            result: false,
            errors: errors,
        }
        return data
    } else {
        if (errors === 0) {
            points = points + 5
        } else if (errors === 1) {
            points = points + 2
        } else if (errors >= 2) {
            points = points + 1
        }
        userProgressIndex++
        if (room.gameState.triviaIndex === 0) {
            user.game.trivia.easy.errors.push(0)
        } else if (room.gameState.triviaIndex === 1) {
            user.game.trivia.medium.errors.push(0)
        } else if (room.gameState.triviaIndex === 2) {
            user.game.trivia.hard.errors.push(0)
        }
        const data = {
            points: points,
            result: true,
            errors: errors,
        }
        return data
    }
}

// // word scrambler

// function getWords(client) {

//     const connectedClient = socketUsers[client.id]
//     connectedClient.listOfWords = {}

//     return randomWords({ exactly: 10, maxLength: 5 })

// }

// Reset Game

function gameReset(room) {
    room.gameState = {
        triviaIndex: 0,
        randomizedCrushes: [],
        topVotedCrush: {},
        votes: [],
        triviaGames: []
    }

    // NEEDS TO CHANGE -- Laurent
    let clients = room.clients
    for (const client in clients) {
        let game = {
            crushVote: null,
            trivia: {
                easy: {
                    questions: [],
                    errors: [],
                    progressIndex: 0,
                    points: 0,
                },
                medium: {
                    questions: [],
                    errors: [],
                    progressIndex: 0,
                    points: 0,
                },
                hard: {
                    questions: [],
                    errors: [],
                    progressIndex: 0,
                    points: 0,
                }
            },
            finalPoints: 0,
            finalPosition: null,
        }
        clients[client].game = game
    }
}

// Reset Player (If player leave)

// Victory
function handleGetVictory(players, room) {

    // NEEDS TO CHANGE TO GIVE USERS MORE INFORMATION Laurent


    let topPlayerPoints = 0
    let topPlayers = []
    let winningPlayer = null
    for (const player in players) {
        console.log('player trivia points', players[player].triviaPts)
        if (players[player].triviaPts >= topPlayerPoints) {
            topPlayerPoints = players[player].triviaPts
        }
    }

    console.log('topPlayerPoints', topPlayerPoints)
    for (const player in players) {
        if (players[player].triviaPts === topPlayerPoints) {
            topPlayers.push(players[player])
        }
    }

    console.log('topPlayers', topPlayers)

    if (topPlayers.length > 1) {
        winningPlayer = topPlayers[Math.floor(Math.random() * topPlayers.length)]
    } else {
        winningPlayer = topPlayers[0]
    }
    console.log('winning player', winningPlayer)

    let returnPlayer = {
        name: winningPlayer.username,
        points: winningPlayer.triviaPts
    }

    // GAME RESET
    gameReset(room)

    return returnPlayer
}


module.exports = {
    handleServerJoin,
    handleServerDisconnect,
    handleGetAllUsers,
    handleGetUserFromClientId,
    handleGetUserFromUserId,

    handleGameState,

    handleCrushes,
    handleGetCrushFromId,
    handleVote,

    handleTrivia,
    handleUserTriviaStart,
    checkTriviaAnswer,
    nextTrivia,

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
