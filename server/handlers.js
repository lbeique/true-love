
let socketUsers = {}; // wanna use Database instead later



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



module.exports = {
    handleJoin,
    handleDisconnect
}
