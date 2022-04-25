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

const getUserByID = async (userID) => {
    const params = {
        user_id: userID,
    }
    const sqlSelectUserByID = "SELECT * FROM user WHERE user_id = :user_id;"
    const user_info = await database.query(sqlSelectUserByID, params)
    console.log(user_info[0][0])
    return user_info[0][0]
}

// doesn't get user email, password, or delete status
const getAllUsers = async () => {
    const sqlSelectUsers = "SELECT user_id, user_name, email, creation_date, game_currency, total_points FROM user ORDER BY total_points DESC;"
    const all_user_info = await database.query(sqlSelectUsers)
    console.log(all_user_info[0])
    return all_user_info[0]
}

const addUser = async (postBody) => {
    console.log('db adduser post body', postBody)
    const newUser = new UserValidation(postBody.email, postBody.password)
    console.log(newUser.validateEmail())
    console.log(newUser.validatePassword())
    if (!newUser.validateEmail() || newUser.validatePassword()) {
        return
    }
    const password = postBody.password
    const encryptedPassword = await bcrypt.hash(password, 10)
    const params = {
        name: postBody.name,
        email: postBody.email,
        password: encryptedPassword,
        currency: 0,
        points: 0
    }
    const sqlInsertUser = "INSERT INTO user (user_name, email, password_hash, creation_date, game_currency, total_points) VALUES (:name, :email, :password, NOW(), :currency, :points);"
    const result = await database.query(sqlInsertUser, params)
    console.log('db adduser result', result[0])
    if (result[0]) {
        const user_info = await getUserByID(result[0].insertId)
        console.log(user_info)
        return user_info
    }

}

const updateUserPoints = async (userID, points) => {
    const params = {
        user_id: userID,
        points: points
    }
    const sqlUpdatePoints = "UPDATE user SET total_points = total_points + :points WHERE user_id = :user_id;"
    await database.query(sqlUpdatePoints, params)
    return
}

const deleteUser = async (userID) => {
    const params = {
        user_id: userID
    }
    const sqlDeleteUser = "DELETE FROM user WHERE user_id = :user_id;"
    await database.query(sqlDeleteUser, params)
    return
}

module.exports = { addUser, getUserByLogin, getUserByID, getAllUsers, updateUserPoints, deleteUser }