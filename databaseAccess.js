const database = require("./databaseConnection")
const bcrypt = require('bcrypt')
const UserValidation = require('./validateEmailPassword')

const getUserByLogin = async (postBody) => {
    const identifier = postBody.userNameOrEmail
    const password = postBody.password
    const params = {
        identifier: identifier,
    }
    const sqlSelectUserByEmail = "SELECT * FROM user WHERE email = :identifier OR user_name = :identifier;"
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
        user_id: userId,
    }
    const sqlSelectUserByID = "SELECT * FROM user WHERE user_id = :user_id;"
    const user_info = await database.query(sqlSelectUserByID, params)
    console.log(user_info[0][0])
    return user_info[0][0]
}

// used for leaderboard -- NEEDS TO BE UPDATED
// doesn't get user email, password, or delete status
const getAllUsers = async () => {
    const sqlSelectUsers = "SELECT user_id, user_name, email, creation_date FROM user;"
    const all_user_info = await database.query(sqlSelectUsers)
    console.log(all_user_info[0])
    return all_user_info[0]
}

const addUser = async (postBody) => {
    console.log('db adduser post body', postBody)
    // const newUser = new UserValidation(postBody.email, postBody.password)
    // console.log(newUser.validateEmail())
    // console.log(newUser.validatePassword())
    // if (!newUser.validateEmail() || newUser.validatePassword()) {
    //     return
    // }
    const password = postBody.password
    const encryptedPassword = await bcrypt.hash(password, 10)
    const params = {
        name: postBody.name,
        email: postBody.email,
        password: encryptedPassword,
        currency: 0,
        points: 0
    }
    const sqlInsertUser = "INSERT INTO user (user_name, email, password_hash, creation_date) VALUES (:name, :email, :password, CURRENT_TIMESTAMP);"
    const result = await database.query(sqlInsertUser, params)
    console.log('db adduser result', result[0])
    if (result[0]) {
        const user_info = await getUserByID(result[0].insertId)
        console.log(user_info)
        return user_info
    }

}

// // Might change or remove entirely -- ask Patrick if it gets too complicated -- Laurent
// const updateUserPoints = async (userId, points) => {
//     const params = {
//         user_id: userId,
//         points: points
//     }
//     const sqlUpdatePoints = "UPDATE user SET total_points = total_points + :points WHERE user_id = :user_id;"
//     await database.query(sqlUpdatePoints, params)
//     return
// }

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
    const user_avatar_info = await database.query(sqlUpdateUserAvatar, params)
    console.log(user_avatar_info[0][0])
    return user_avatar_info[0][0]
}

// Need an access for retrieving a crush by its id

const getCrushByID = async (crushId) => {
    const params = {
        crush_id: crushId,
    }
    const sqlSelectCrushByID = "SELECT crush_id, category.category_id, category.category_api_id, category.category_name, crush_name, crush_nickname, crush_likes, crush_dislikes FROM crush JOIN category on category.category_id = crush.category_id WHERE crush_id = :crush_id;"
    const crush_info = await database.query(sqlSelectCrushByID, params)
    console.log(crush_info[0][0])
    return crush_info[0][0]
}

// Need an access for retrieving achievements from user id - user_achievement table (ahievement_id, achievement_name)

const getUserAchievements = async (userId) => {
    const params = {
        user_id: userId
    }
    const sqlSelectUserAchievements = "SELECT achievement.achievement_id, achievement.achievement_name FROM achievement JOIN user_achievement ON user_achievement.achievement_id = achievement.achievement_id JOIN user ON user_achievement.user_id = user.user_id WHERE user.user_id = :user_id;"
    const user_achievement_info = await database.query(sqlSelectUserAchievements, params)
    console.log(user_achievement_info[0])
    return user_achievement_info[0]
}

// Need an access for updating a user achievement from crush_id

const addUserAchievement = async (userId, crushId) => {
    const params = {
        user_id: userId,
        crush_id: crushId
    }
    const sqlInsertUserAchievement = "INSERT INTO user_achievement (user_id, achievement_id) VALUES (:user_id, :crush_id);"
    const result = await database.query(sqlInsertUserAchievement, params)
    console.log('db adduser result', result[0])
    if (result[0]) {
        const user_achievement_info = await getUserAchievements(userId)
        console.log(user_achievement_info)
        return user_achievement_info
    }
}

// Need an access for retrieving global leaderboard information (user_name, avatar_id, Favourite Category, Top Points, Top Wins, Win/Loss Ratio)
const getGlobalLeaderboard = async () => {
    const sqlSelectGlobalLeaderboard = ""
    const global_leaderboard = await database.query(sqlSelectGlobalLeaderboard)
    console.log(global_leaderboard[0])
    return global_leaderboard[0]
}

// Need an access for adding a new room - room table (room_name, crush_id, category_id_easy, category_id_medium, category_id_hard, date)
// Need an access for adding a new room - user_room table ((all)user_id, (all)room_id, (all)easy_points), (all)easy_errors, (all)medium_points, (all)medium_errors, (all)hard_points, (all)easy_points)

// Need an access for retrieving a room brief information (room_id, user_id, user_name, avatar_id, category_id_easy, easy_points, easy_errors, category_id_medium, medium_points, medium_errors, category_id_hard, hard_points, easy_points, date)

// Need an access for retrieving a room full information (room_id, room_name, (all)user_id, (all)user_name, (all)avatar_id, category_id_easy, (all)easy_points), (all)easy_errors, category_id_medium, (all)medium_points, (all)medium_errors, category_id_hard, (all)hard_points, (all)easy_points, date)

// Need an access for retrieving category name from category id (category_name) --- Look at UNION for going through the table 3 times

// Need an access for retrieving crush from crush id (crush_id, category_id, crush_name, crush_nickname, crush_likes, crush_dislikes)



module.exports = { addUser, getUserByLogin, getUserByID, getAllUsers, deleteUser }