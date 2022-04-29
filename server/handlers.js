let socketUsers = {}; // wanna use Database instead later - maybe??
let lobbyRooms = {};



// Server Handlers

function handleServerJoin(client, user_name) {

    const randomAvatars = [`🧋`, `☕️`, `💩`, `💃`, `🦊`, `🦄`];

    const avatarIndex = Math.floor(Math.random() * randomAvatars.length);

    const player = {
        socketId: client.id,
        username: user_name,
        avatar: randomAvatars[avatarIndex]
    };

    socketUsers[client.id] = player;

    // socket.join("gameRoom");
    // console.log(`${socket.id} is now in the room`);

    // const clients = io.in('gameRoom').allSockets(); // RETURNS PROMISE
    // console.log('CLIENTS', clients);

    console.log(`${player.socketId} has joined the server`);
    return

}



function handleServerDisconnect(client) {
    console.log(client.id, 'has been disconnected :(((');

    delete socketUsers[client.id];

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






module.exports = {
    handleServerJoin,
    handleServerDisconnect,
    handleTrivia,
    checkTriviaAnswer,
    nextTrivia
}
