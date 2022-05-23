const database = require("./databaseConnection")
const bcrypt = require('bcrypt')
const UserValidation = require('./validateEmailPassword')

const getUserByLogin = async (postBody) => {
    const identifier = postBody.userNameOrEmail
    const password = postBody.password
    const params = {
        identifier: identifier,
    }
    const sqlSelectUserByEmail = "SELECT user.user_id, avatar.avatar_name, user.user_name, user.password_hash FROM user JOIN avatar ON avatar.avatar_id = user.avatar_id WHERE email = :identifier OR user_name = :identifier;"
    const user_info = await database.query(sqlSelectUserByEmail, params)
    console.log('database', user_info[0][0])
    if (user_info[0][0]) {
        const match = await bcrypt.compare(password, user_info[0][0].password_hash)
        if (match) {
            return user_info[0][0]
        }
    }
}

const getUserByID = async (userId) => {
    const params = {
        user_id: +userId,
    }

    const sqlSelectUserByID = "SELECT user.user_id, avatar.avatar_name, user.user_name, user.password_hash FROM user JOIN avatar ON avatar.avatar_id = user.avatar_id WHERE user.user_id = :user_id;"
    const user_info = await database.query(sqlSelectUserByID, params)
    console.log('database', user_info[0][0])
    return user_info[0][0]
}

// doesn't get user email, password, or delete status
const getAllUsers = async () => {
    const sqlSelectUsers = "SELECT user_id, user_name, email, creation_date FROM user;"
    const all_user_info = await database.query(sqlSelectUsers)
    console.log('database', all_user_info[0])
    return all_user_info[0]
}

const addUser = async (postBody) => {
    console.log('db adduser post body', postBody)
    const checkUserResult = await checkUsername(postBody.name)
    if (checkUserResult.user_matches === 0) {
        const password = postBody.password
        const encryptedPassword = await bcrypt.hash(password, 10)
        const params = {
            name: postBody.name,
            password: encryptedPassword,
            currency: 0,
            points: 0
        }
        const sqlInsertUser = "INSERT INTO user (user_name, password_hash, creation_date) VALUES (:name, :password, CURRENT_TIMESTAMP);"
        const result = await database.query(sqlInsertUser, params)
        console.log('db adduser result', result[0])
        if (result[0]) {
            const user_info = await getUserByID(result[0].insertId)
            console.log(user_info)
            return user_info
        }
        return
    }
    return
}

const checkUsername = async (username) => {
    const params = {
        user_name: username,
    }
    const sqlSelectUserByID = "SELECT COUNT(*) AS user_matches FROM user WHERE user_name = :user_name;"
    const user_matches = await database.query(sqlSelectUserByID, params)
    console.log('database', user_matches[0][0])
    return user_matches[0][0]
}

const updateUsername = async (userId, username) => {
    const params = {
        user_id: userId,
        user_name: username
    }

    const matches = await checkUsername(username)
    if (matches.user_matches === 0) {
        const sqlUpdateUsername = "UPDATE user SET user_name = :user_name WHERE user_id = :user_id;"
        await database.query(sqlUpdateUsername, params)
        const user_info = await getUserByID(userId)
        return user_info
    }
    return
}

const deleteUser = async (userId) => {
    const params = {
        user_id: userId
    }
    const sqlDeleteUser = "DELETE FROM user WHERE user_id = :user_id;"
    await database.query(sqlDeleteUser, params)
    console.log('user deleted')
    return
}

// Need an access for retrieving all avatars

const getAllAvatars = async () => {
    const sqlSelectAllAvatars = "SELECT * FROM avatar;"
    const avatars = await database.query(sqlSelectAllAvatars)
    console.log(avatars[0])
    return avatars[0]
}

// Need an access for retrieving user avatar

const getUserAvatar = async (userId) => {
    const params = {
        user_id: userId
    }
    const sqlSelectUserAvatar = "SELECT avatar.avatar_id, avatar.avatar_name FROM avatar JOIN user ON user.avatar_id = avatar.avatar_id WHERE user.user_id = :user_id;"
    const user_avatar_info = await database.query(sqlSelectUserAvatar, params)
    console.log(user_avatar_info[0][0])
    return user_avatar_info[0][0]
}

// Need an access for updating a user avatar

const updateUserAvatar = async (userId, avatarId) => {
    const params = {
        user_id: userId,
        avatar_id: avatarId
    }
    const sqlUpdateUserAvatar = "UPDATE user SET avatar_id = :avatar_id WHERE user_id = :user_id;"
    await database.query(sqlUpdateUserAvatar, params)
    const user_avatar_info = await getUserAvatar(userId)
    console.log('database', user_avatar_info)
    return user_avatar_info
}

// Need an access for retrieving a crush by its id

const getCrushByID = async (crushId) => {
    const params = {
        crush_id: crushId,
    }
    const sqlSelectCrushByID = "SELECT crush_id, category.category_id, category.category_api_id, category.category_name, crush_name, crush_nickname, crush_likes, crush_dislikes FROM crush JOIN category on category.category_id = crush.category_id WHERE crush_id = :crush_id;"
    const crush_info = await database.query(sqlSelectCrushByID, params)
    console.log(crush_info[0][0])
    // {crush_id, category_id, category_api_id, category_name, crush_name, crush_nickname, crush_likes, crush_dislikes}
    return crush_info[0][0]
}

// Need an access for retrieving achievements from user id - user_achievement table (ahievement_id, achievement_name)

const getUserAchievements = async (userId) => {
    const params = {
        user_id: userId
    }
    const sqlSelectUserAchievements = "SELECT achievement.achievement_id, achievement.achievement_name FROM achievement JOIN user_achievement ON user_achievement.achievement_id = achievement.achievement_id JOIN user ON user_achievement.user_id = user.user_id WHERE user.user_id = :user_id;"
    const user_achievement_info = await database.query(sqlSelectUserAchievements, params)
    console.log('database', user_achievement_info[0])
    return user_achievement_info[0]
}

// Need an access for updating a user achievement from crush_id

const addUserAchievement = async (userId, crushId) => {
    const user_achievement_info = await getUserAchievements(userId)
    if (user_achievement_info.filter(achievement => achievement.achievement_id === crushId).length === 0) {
        const params = {
            user_id: userId,
            crush_id: crushId
        }
        const sqlInsertUserAchievement = "INSERT INTO user_achievement (user_id, achievement_id) VALUES (:user_id, :crush_id);"
        await database.query(sqlInsertUserAchievement, params)
        return
    }
    return
}

// An access that gives the winner and game information of the last 50 games played
const getGlobalMatchHistory = async () => {
    const sqlSelectGlobalMatchHistory = "SELECT winningscore_by_room.room_id, crush.crush_nickname, user.user_id, user.user_name, winningscore_by_room.total_score, winningscore_by_room.total_players, room.date FROM (SELECT room_id, MAX(easy_points+medium_points+hard_points) AS total_score, COUNT(user_id) AS total_players FROM user_room GROUP BY room_id) AS winningscore_by_room JOIN user_room ON winningscore_by_room.room_id = user_room.room_id AND winningscore_by_room.total_score = (easy_points+medium_points+hard_points) JOIN user ON user.user_id = user_room.user_id JOIN room ON room.room_id = user_room.room_id JOIN crush ON crush.crush_id = room.crush_id ORDER BY room.date DESC LIMIT 50;"
    const global_match_history = await database.query(sqlSelectGlobalMatchHistory)
    console.log('database', global_match_history[0])
    // [
    //     {
    //         room_id, 
    //         crush_nickname, 
    //         user_id, 
    //         user_name, 
    //         avatar_id, 
    //         total_score, 
    //         total_players, 
    //         date
    //     }
    // ]
    return global_match_history[0]
}


// Need an access for retrieving global leaderboard information (user_name, avatar_id, Favourite Category, Total Points, Total Wins, Win/Loss Ratio)
const getGlobalLeaderboard = async () => {
    const sqlSelectGlobalLeaderboard = "SELECT user.user_id, user.user_name, user.avatar_id, avatar.avatar_name, IFNULL(total_points.total_points,0) AS total_points, IFNULL(total_wins,0) AS total_wins, IFNULL((total_wins.total_wins / (IFNULL(total_wins.total_wins,0) + IFNULL(total_losses.total_losses,0))),0) AS win_ratio FROM (SELECT user_id, SUM(easy_points+medium_points+hard_points) AS total_points FROM user_room GROUP BY user_id) AS total_points LEFT JOIN (SELECT user_id, IFNULL(COUNT(position),0) AS total_wins FROM user_room WHERE position = 1 GROUP BY user_id) AS total_wins ON total_wins.user_id = total_points.user_id LEFT JOIN (SELECT user_id, IFNULL(COUNT(position),0) AS total_losses FROM user_room WHERE position != 1 GROUP BY user_id) AS total_losses ON total_losses.user_id = total_points.user_id RIGHT JOIN user ON user.user_id = total_points.user_id RIGHT JOIN avatar ON user.avatar_id = avatar.avatar_id ORDER BY total_wins.total_wins DESC, win_ratio DESC, total_points DESC"
    const global_leaderboard = await database.query(sqlSelectGlobalLeaderboard)
    console.log('database', global_leaderboard[0])
    return global_leaderboard[0]
}

    // [
    //     { 
    //         user_id, 
    //         user_name, 
    //         avatar_id,
    //         avatar_name 
    //         total_points, 
    //         total_wins, 
    //         win_ratio
    //     }
    // ]



// Need an access for adding a new room - room table (room_name, crush_id, category_id_easy, category_id_medium, category_id_hard, date)
// Need an access for adding a new room - user_room table ((all)user_id, (all)room_id, (all)easy_points), (all)easy_errors, (all)medium_points, (all)medium_errors, (all)hard_points, (all)easy_points)

const addUsersToRoom = async (room, insertId) => {
    const values = []
    let players = room.clients
    for (const player in players) {
        values.push(
            [
                players[player].userId,
                insertId,
                players[player].game.position,
                players[player].game.trivia.easy.points,
                players[player].game.trivia.easy.errors.reduce((accumulator, error) => accumulator + error, 0),
                players[player].game.trivia.medium.points,
                players[player].game.trivia.medium.errors.reduce((accumulator, error) => accumulator + error, 0),
                players[player].game.trivia.hard.points,
                players[player].game.trivia.hard.errors.reduce((accumulator, error) => accumulator + error, 0)
            ])
    }
    const sqlInsertUsersInRoom = "INSERT INTO user_room (user_id, room_id, position, easy_points, easy_errors, medium_points, medium_errors, hard_points, hard_errors) VALUES ?;"
    const result = await database.query(sqlInsertUsersInRoom, [values])
    if (result[0]) {
        console.log('users saved to room succesfully')
    }
    return
}

const saveGame = async (room) => {
    const params = {
        crush_id: room.gameState.topVotedCrush.id,
        category_easy_id: room.gameState.topVotedCrush.categoryEasy.db,
        category_medium_id: room.gameState.topVotedCrush.categoryMedium.db,
        category_hard_id: room.gameState.topVotedCrush.categoryHard.db,
        room_name: room.room_name
    }
    const sqlInsertRoom = "INSERT INTO room (crush_id, category_easy_id, category_medium_id, category_hard_id, room_name, date) VALUES (:crush_id, :category_easy_id, :category_medium_id, :category_hard_id, :room_name, CURRENT_TIMESTAMP);"
    const room_result = await database.query(sqlInsertRoom, params)
    console.log('db addroom result', room_result[0])
    if (room_result[0]) {
        await addUsersToRoom(room, room_result[0].insertId)
        return
    }

}

// Need an access for retrieving a room brief information (room_id, user_id, user_name, avatar_id, category_id_easy, easy_points, easy_errors, category_id_medium, medium_points, medium_errors, category_id_hard, hard_points, easy_points, date)

const getUserMatchHistory = async (userId) => {
    const params = {
        user_id: userId,
    }
    const sqlSelectUserMatchHistory = "SELECT score_by_room.room_id, user_room.position, crush.crush_nickname, user.user_id, user.user_name, easy.category_id AS easy_category_id, easy.category_name AS easy_category_name, user_room.easy_points, user_room.easy_errors, medium.category_id AS medium_category_id, medium.category_name AS medium_category_name, user_room.medium_points, user_room.medium_errors, hard.category_id AS hard_category_id, hard.category_name AS hard_category_name, user_room.hard_points, user_room.hard_errors, score_by_room.score_by_room.total_points, score_by_room.total_errors, players_in_room.total_players, room.date FROM (SELECT room_id, (easy_points+medium_points+hard_points) AS total_points, (easy_errors+medium_errors+hard_errors) AS total_errors FROM user_room WHERE user_room.user_id = :user_id GROUP BY room_id) AS score_by_room JOIN (SELECT room_id, COUNT(user_id) AS total_players FROM user_room GROUP BY room_id) AS players_in_room ON players_in_room.room_id = score_by_room.room_id JOIN user_room ON score_by_room.room_id = user_room.room_id JOIN user ON user.user_id = user_room.user_id JOIN room ON room.room_id = user_room.room_id JOIN category AS easy ON easy.category_id = room.category_easy_id JOIN category AS medium ON medium.category_id = room.category_medium_id JOIN category AS hard ON hard.category_id = room.category_hard_id JOIN crush ON crush.crush_id = room.crush_id WHERE user.user_id = :user_id ORDER BY room.date DESC LIMIT 50;"
    const user_match_history = await database.query(sqlSelectUserMatchHistory, params)
    console.log('database', user_match_history[0])
    // [
    //     {
    //         room_id,
    //         position,
    //         crush_nickname,
    //         user_id,
    //         user_name,
    //         easy_category_id,
    //         easy_category_name,
    //         easy_points,
    //         easy_errors,
    //         medium_category_id,
    //         medium_category_name,
    //         medium_points,
    //         medium_errors,
    //         hard_category_id,
    //         hard_category_name,
    //         hard_points,
    //         hard_errors,
    //         total_points,
    //         total_errors,
    //         total_players,
    //         date
    //     }
    // ]
    return user_match_history[0]
}


// Need an access for retrieving a room full information (room_id, room_name, (all)user_id, (all)user_name, (all)avatar_id, category_id_easy, (all)easy_points), (all)easy_errors, category_id_medium, (all)medium_points, (all)medium_errors, category_id_hard, (all)hard_points, (all)easy_points, date)

const getRoomInformationByRoomId = async (roomId) => {
    const params = {
        room_id: roomId
    }
    const sqlSelectRoomInformation = "SELECT room.room_id, room.room_name, crush.crush_name, crush.crush_nickname, user_room.position, user.user_id, user.user_name, user.avatar_id, easy.category_id AS easy_category_id, easy.category_name AS easy_category_name, user_room.easy_points, user_room.easy_errors, medium.category_id AS medium_category_id, medium.category_name AS medium_category_name, user_room.medium_points, user_room.medium_errors, hard.category_id AS hard_category_id, hard.category_name AS hard_category_name, user_room.hard_points, user_room.hard_errors, (easy_points + medium_points + hard_points) AS total_points, (easy_errors + medium_errors + hard_errors) AS total_errors, room.date FROM room JOIN user_room ON user_room.room_id = room.room_id JOIN user ON user.user_id = user_room.user_id JOIN crush ON crush.crush_id = room.crush_id JOIN category AS easy ON easy.category_id = room.category_easy_id JOIN category AS medium ON medium.category_id = room.category_medium_id JOIN category AS hard ON hard.category_id = room.category_hard_id WHERE room.room_id = :room_id ORDER BY total_points DESC;"
    const room_information = await database.query(sqlSelectRoomInformation, params)
    console.log('database', room_information[0])
    // [
    //     {
    //         room_id,
    //         room_name,
    //         crush_name,
    //         crush_nickname,
    //         position,
    //         user_id,
    //         user_name,
    //         avatar_id,
    //         easy_category_id,
    //         easy_category_name,
    //         easy_points,
    //         easy_errors,
    //         medium_category_id,
    //         medium_category_name,
    //         medium_points,
    //         medium_errors,
    //         hard_category_id,
    //         hard_category_name,
    //         hard_points,
    //         hard_errors,
    //         total_points,
    //         total_errors,
    //         total_players,
    //         date
    //     }
    // ]
    return room_information[0]
}


// Need an access for retrieving category name from category id (category_name) --- Look at UNION for going through the table 3 times

const getCategoryById = async (categoryId) => {
    const params = {
        category_id: categoryId
    }
    const sqlSelectCategoryById = "SELECT category_id, category_api_id, category_name FROM category WHERE category_id = :category_id;"
    const category_information = await database.query(sqlSelectCategoryById, params)
    console.log('database', category_information[0][0])
    return category_information[0][0]
}

const getCategoriesById = async (categoryEasyId, categoryMediumId, categoryHardId) => {
    const params = {
        category_easy_id: categoryEasyId,
        category_medium_id: categoryMediumId,
        category_hard_id: categoryHardId,
    }
    const sqlSelectCategoriesById = "SELECT easy.category_id AS easy_category_id, easy.category_api_id AS easy_category_api_id, easy.category_name AS easy_category_name, medium.category_id AS medium_category_id, medium.category_api_id AS medium_category_api_id, medium.category_name AS medium_category_name, hard.category_id AS hard_category_id, hard.category_api_id AS hard_category_api_id, hard.category_name AS hard_category_name FROM (SELECT category_id, category_api_id, category_name FROM category WHERE category_id = :category_easy_id) AS easy JOIN (SELECT category_id, category_api_id, category_name FROM category WHERE category_id = :category_medium_id) AS medium JOIN (SELECT category_id, category_api_id, category_name FROM category WHERE category_id = :category_hard_id) AS hard;"
    const categories_information = await database.query(sqlSelectCategoriesById, params)
    console.log('database', categories_information[0][0])
    // {easy_category_id, easy_category_api_id, easy_category_name, 
    // medium_category_id, medium_category_api_id, medium_category_name,
    // hard_category_id, hard_category_api_id, hard_category_name}
    return categories_information[0][0]
}


module.exports = { addUser, getUserByLogin, getUserByID, getAllUsers, getUserAchievements, updateUserAvatar, deleteUser, updateUsername, getGlobalMatchHistory, getUserMatchHistory, getRoomInformationByRoomId, getGlobalLeaderboard, saveGame, addUserAchievement }