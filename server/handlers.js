require('dotenv').config()
const fetch = require('node-fetch')
const { arrayClone } = require('../utils/utilities')

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
                    points: 0
                },
                medium: {
                    questions: [],
                    errors: [],
                    progressIndex: 0,
                    points: 0
                },
                hard: {
                    questions: [],
                    errors: [],
                    progressIndex: 0,
                    points: 0
                }
            },
            totalPoints: 0,
            position: null,
            animate: 0,
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
                usersVoted: false,
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

    const crushesClone = arrayClone(crushes) // copy
    const categoriesClone = arrayClone(categories)
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

function handleVote(votedCrush, user, room) {

    console.log("PASSED user", user)

    user.game.crushVote = votedCrush.id

    room.gameState.votes.push(votedCrush.id)

    console.log('gameStateVotes track', room.gameState.votes) // basically trackVoteArr

    // This will need to change slightly, need to add a check to make sure everyone present in lobby has voted as well - Laurent
    if (room.gameState.votes.length >= room.num_clientInRoom && !room.gameState.usersVoted) {
        const resultCalculation = {}
        room.gameState.usersVoted = true
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
            clientId: user.userId
        }

        return data // returns an object

    } else {

        return user.userId // returns a string

    }
}


// TRIVIA HANDLERS

function handleTrivia(trivias, room) {
    let users = room.clients
    for (const user in users) {
        users[user].game.animate = 0
    }

    for (let i = trivias.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [trivias[i], trivias[j]] = [trivias[j], trivias[i]];
    }

    let clientTriviaQuestions = []
    let correctTriviaAnswers = []
    for (let i = 0; i < trivias.length; i++) {
        let shuffledAnswers = []
        let triviaQuestion = {}
        shuffledAnswers = arrayClone(trivias[i].incorrect_answers)
        shuffledAnswers.push(trivias[i].correct_answer)
        shuffledAnswers.sort(() => 0.5 - Math.random()) // shuffle the multiple choices
        triviaQuestion.difficulty = trivias[i].difficulty
        triviaQuestion.category = trivias[i].category
        triviaQuestion.shuffledAnswers = shuffledAnswers
        triviaQuestion.question = trivias[i].question

        clientTriviaQuestions.push(triviaQuestion)
        correctTriviaAnswers.push(trivias[i].correct_answer)
    }

    if (room.gameState.triviaIndex === 0) {
        room.gameState.triviaGames.easyClient = clientTriviaQuestions
        room.gameState.triviaGames.easyAnswers = correctTriviaAnswers
    } else if (room.gameState.triviaIndex === 1) {
        room.gameState.triviaGames.mediumClient = clientTriviaQuestions
        room.gameState.triviaGames.mediumAnswers = correctTriviaAnswers
    } else if (room.gameState.triviaIndex === 2) {
        room.gameState.triviaGames.hardClient = clientTriviaQuestions
        room.gameState.triviaGames.hardAnswers = correctTriviaAnswers
    }

    return clientTriviaQuestions
}


function nextTrivia(user, room) {

    let userProgressIndex = null
    let nextTrivia = null
    let animate = user.game.trivia.animate

    if (room.gameState.triviaIndex === 0) {
        userProgressIndex = user.game.trivia.easy.progressIndex
        nextTrivia = room.gameState.triviaGames.easyClient[userProgressIndex]
    } else if (room.gameState.triviaIndex === 1) {
        userProgressIndex = user.game.trivia.medium.progressIndex
        nextTrivia = room.gameState.triviaGames.mediumClient[userProgressIndex]
    } else if (room.gameState.triviaIndex === 2) {
        userProgressIndex = user.game.trivia.hard.progressIndex
        nextTrivia = room.gameState.triviaGames.hardClient[userProgressIndex]
    }

    return { nextTrivia, animate }
}

function checkTriviaAnswer(user, room, answer) {

    let userProgressIndex = null
    let errors = null
    let points = null
    let correctAnswer = null

    if (room.gameState.triviaIndex === 0) {
        userProgressIndex = user.game.trivia.easy.progressIndex
        points = user.game.trivia.easy.points
        correctAnswer = room.gameState.triviaGames.easyAnswers[userProgressIndex]
        errors = user.game.trivia.easy.errors[userProgressIndex]

    } else if (room.gameState.triviaIndex === 1) {
        userProgressIndex = user.game.trivia.medium.progressIndex
        points = user.game.trivia.medium.points
        correctAnswer = room.gameState.triviaGames.mediumAnswers[userProgressIndex]
        errors = user.game.trivia.medium.errors[userProgressIndex]

    } else if (room.gameState.triviaIndex === 2) {
        userProgressIndex = user.game.trivia.hard.progressIndex
        points = user.game.trivia.hard.points
        correctAnswer = room.gameState.triviaGames.hardAnswers[userProgressIndex]
        errors = user.game.trivia.hard.errors[userProgressIndex]
    }

    if (answer !== correctAnswer) {
        user.game.trivia.animate = 1
        if (room.gameState.triviaIndex === 0) {
            if (!errors) {
                user.game.trivia.easy.errors.push(1)
            } else {
                user.game.trivia.easy.errors[userProgressIndex]++
            }
        } else if (room.gameState.triviaIndex === 1) {
            if (!errors) {
                user.game.trivia.medium.errors.push(1)
            } else {
                user.game.trivia.medium.errors[userProgressIndex]++
            }
        } else if (room.gameState.triviaIndex === 2) {
            if (!errors) {
                user.game.trivia.hard.errors.push(1)
            } else {
                user.game.trivia.hard.errors[userProgressIndex]++
            }
        }
        const data = {
            points: points,
            result: false,
            errors: errors,
        }
        return data
    } else {
        user.game.trivia.animate = 0
        if (!errors) {
            if (room.gameState.triviaIndex === 0) {
                user.game.trivia.easy.errors.push(0)
            } else if (room.gameState.triviaIndex === 1) {
                user.game.trivia.medium.errors.push(0)
            } else if (room.gameState.triviaIndex === 2) {
                user.game.trivia.hard.errors.push(0)
            }
            points = points + 5
            user.game.totalPoints = user.game.totalPoints + 5
        } else if (errors === 1) {
            points = points + 3
            user.game.totalPoints = user.game.totalPoints + 3
        } else if (errors >= 2) {
            points = points + 1
            user.game.totalPoints = user.game.totalPoints + 1
        }
        if (room.gameState.triviaIndex === 0) {
            user.game.trivia.easy.points = points
            user.game.trivia.easy.questions.push(room.gameState.triviaGames.easyClient[user.game.trivia.easy.progressIndex])
            user.game.trivia.easy.progressIndex++

        } else if (room.gameState.triviaIndex === 1) {
            user.game.trivia.medium.points = points
            user.game.trivia.medium.questions.push(room.gameState.triviaGames.mediumClient[user.game.trivia.medium.progressIndex])
            user.game.trivia.medium.progressIndex++

        } else if (room.gameState.triviaIndex === 2) {
            user.game.trivia.hard.points = points
            user.game.trivia.hard.questions.push(room.gameState.triviaGames.hardClient[user.game.trivia.hard.progressIndex])
            user.game.trivia.hard.progressIndex++

        }
        const data = {
            points: points,
            result: true,
            errors: errors,
        }
        return data
    }
}


// Reset Game
function gameReset(room) {

    // MUST ALWAYS KEEP UP TO DATE -- Laurent
    room.gameState = {
        game_active: false,
        usersVoted: false,
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
    }

    // MUST ALWAYS KEEP UP TO DATE -- Laurent
    let clients = room.clients
    for (const client in clients) {
        clients[client].game = {
            crushVote: null,
            trivia: {
                easy: {
                    questions: [],
                    errors: [],
                    progressIndex: 0,
                    points: 0
                },
                medium: {
                    questions: [],
                    errors: [],
                    progressIndex: 0,
                    points: 0
                },
                hard: {
                    questions: [],
                    errors: [],
                    progressIndex: 0,
                    points: 0
                }
            },
            totalPoints: 0,
            position: null,
            animate: 0,
        }
    }
}

// Reset User
function userReset(user) {

    // MUST ALWAYS KEEP UP TO DATE -- Laurent
    user.game = {
        crushVote: null,
        trivia: {
            easy: {
                questions: [],
                errors: [],
                progressIndex: 0,
                points: 0
            },
            medium: {
                questions: [],
                errors: [],
                progressIndex: 0,
                points: 0
            },
            hard: {
                questions: [],
                errors: [],
                progressIndex: 0,
                points: 0
            }
        },
        totalPoints: 0,
        position: null,
        animate: 0,
    }

}


// Victory
function handleGetVictory(room, leaderboard) {

    // NEEDS TO CHANGE -- Laurent
    let winner = leaderboard[0]

    // SAVE GAME TO DATABASE HERE




    // GAME RESET
    gameReset(room)

    return { winner, leaderboard }
}


function handleCreateLeaderboard(room) {
    let players = room.clients
    for (const player in players) {

        /////////// PLAYER OBJECT USED IN ANALYTICS /////////
        let playerObject = {
            userId: players[player].userId,
            username: players[player].username,
            avatar: players[player].avatar,
            points: players[player].game.totalPoints,
        }
        room.gameState.leaderboard.push(playerObject)
    }
    return room.gameState.leaderboard
}


function handleUpdateLeaderboard(room) {
    let players = room.clients
    let leaderboard = room.gameState.leaderboard
    for (const entry of leaderboard) {
        for (const player in players) {
            if (entry.userId === players[player].userId) {
                entry.points = players[player].game.totalPoints
            }
        }
    }
    leaderboard.sort((b, a) => (a.points > b.points) ? 1 : ((b.points > a.points) ? -1 : 0))
    for (const player in players) {
        for (let i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i].userId === players[player].userId) {
                players[player].game.position = i
            }
        }
    }
    return leaderboard
}


function handleLoungeGameInfo(room, leaderboard, dialogue, nextTrivia) {
    let gameInfo = {
        name: room.gameState.topVotedCrush.name,
        nickname: room.gameState.topVotedCrush.nickname,
        nextTrivia: nextTrivia,
        leaderboard: leaderboard,
        dialogue: dialogue,
    }
    return gameInfo
}





module.exports = {
    handleServerJoin,
    handleServerDisconnect,
    handleGetAllUsers,
    handleGetUserFromClientId,
    handleGetUserFromUserId,

    handleGameState,

    handleCreateLeaderboard,
    handleUpdateLeaderboard,

    handleCrushes,
    handleGetCrushFromId,
    handleVote,

    handleTrivia,
    checkTriviaAnswer,
    nextTrivia,

    handleLoungeGameInfo,

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