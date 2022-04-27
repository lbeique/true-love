
let socketUsers = {}; // wanna use Database instead later - maybe??
let gameRoom = {};

function handleJoin(client) {

    const randomAvatars = [`🧋`, `☕️`, `💩`, `💃`, `🦊`, `🦄`];

    const avatarIndex = Math.floor(Math.random() * randomAvatars.length);

    const player = {
        socketId: client.id,
        username: 'chicken',
        avatar: randomAvatars[avatarIndex]
    };

    socketUsers[client.id] = player; // will need to insert into database

    // socket.join("gameRoom");
    // console.log(`${socket.id} is now in the room`);

    // const clients = io.in('gameRoom').allSockets(); // RETURNS PROMISE
    // console.log('CLIENTS', clients);

    console.log(`${player.socketId} has joined the game`);
    return socketUsers

}



function handleDisconnect(client) {
    console.log(client.id, ' has been disconnected :(((');

    delete socketUsers[client.id];

    return socketUsers;
}



// TRIVIA HANDLERS

function handleTrivia(client, trivias) {
    const connectedClient = socketUsers[client.id]

    connectedClient.triviaQuestions = trivias
    connectedClient.triviaProgressIndex = 0

    return connectedClient.triviaQuestions[connectedClient.triviaProgressIndex]
}

function nextTrivia(client){
    const connectedClient = socketUsers[client.id]
    const questions = connectedClient.triviaQuestions
    const index = connectedClient.triviaProgressIndex

    const trivia = questions[index]
    console.log("TRIVIA", trivia)

    return trivia
}

function checkTriviaAnswer(client , correct_answer, userAnswer){
    const connectedClient = socketUsers[client.id]
    
    if(userAnswer !== correct_answer){
        return false
    } else{
        connectedClient.triviaProgressIndex++
        return true
    }
}











module.exports = {
    handleJoin,
    handleDisconnect,
    handleTrivia,
    checkTriviaAnswer,
    nextTrivia
}
