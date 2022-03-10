const database = require("./databaseConnection");
const bcrypt = require('bcrypt');
const UserValidation = require('./validateEmailPassword');


const addUser = async (postBody, callback) => {
    const newUser = new UserValidation(postBody.email, postBody.password);
    if (newUser.validateEmail() && newUser.validatePassword()) {
        const password = postBody.password;
        const encryptedPassword = await bcrypt.hash(password, 10);
        const params = {
            name: postBody.name,
            email: postBody.email,
            password: encryptedPassword,
            currency: 0,
            points: 0
        }
        const sqlInsertUser = "INSERT INTO user (user_name, email, password_hash, creation_date, game_currency, total_points) VALUES (:name, :email, :password, NOW(), :currency, :points);";
        database.query(sqlInsertUser, params, (err, results, fields) => {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                callback(null, results);
            }
        });
    } else {
        console.log("invalid username/password");
        callback(err, null);
    }
};

const getUserByLogin = (postBody, callback) => {
    const identifier = postBody.userNameOrEmail;
    const password = postBody.password;
    const params = {
        identifier: identifier,
    }
    const sqlSelectUserByEmail = "SELECT * FROM user WHERE email = :identifier OR user_name = :identifier;";
    database.query(sqlSelectUserByEmail, params, (err, results, fields) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            console.log(results);
            if (!results[0]) {
                callback(err, null);
            } else {
                bcrypt.compare(password, results[0].password_hash, (err, same) => {
                    if (same) {
                        callback(null, results[0]);
                        console.log('user logged in')
                    } else {
                        console.log(err);
                        callback(err, null);
                    }
                });
            }
        }
    });
};

const getUserByID = (userID, callback) => {
    const params = {
        user_id: userID,
    }
    const sqlSelectUserByID = "SELECT * FROM user WHERE user_id = :user_id;";
    database.query(sqlSelectUserByID, params, (err, results, fields) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

// doesn't get user email, password, or delete status
const getAllUsers = (callback) => {
    const sqlSelectUsers = "SELECT user_id, user_name, creation_date, game_currency, total_points FROM user;";
    database.query(sqlSelectUsers, (err, results, fields) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

const updateUserPoints = (userID, points, callback) => {
    const params = {
        user_id: userID,
        points: points
    }
    const sqlUpdatePoints = "UPDATE user SET total_points = total_points + :points WHERE user_id = :user_id;";
    database.query(sqlUpdatePoints, params, (err, results, fields) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

const deleteUser = (userID, callback) => {
    const params = {
        user_id: userID
    }
    const sqlDeleteUser = "DELETE FROM user WHERE user_id = :user_id;";
    database.query(sqlDeleteUser, params, (err, results, fields) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

module.exports = { addUser, getUserByLogin, getUserByID, getAllUsers, updateUserPoints, deleteUser }