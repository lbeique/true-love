function makeUsername() {
    let usernames = ['TheRealSam', 'TheFakeSam', 'TwoBunniesOneBasket', 'Domo', 'Tesla', 'Hawkman', 'EagleBird', 'xxXx_Panther_XxxxXx', 'AlienLover42', 'Douglas', 'DaddyDhanji', 'AimeeMommy', 'Mr.X', 'PigeonessMan', 'Ilia', 'MilkTeaBubbleTea', 'Chicken', 'Dostoevsky', 'ItsNotGonnaBeFunny', '', 'Janor', 'Mr.Plum', 'EarlGrey', 'Shrooms', 'AtMostCamera32', 'Jaremy Holeman', 'WestCoast4Life', 'Kendrick Lamar']
    return usernames[Math.floor(Math.random() * usernames.length)]
}

function makeCode(length) {
    let code = ""
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (let i = 0; i < length; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return code
}

function arrayClone(array) {
    return array.map(item => Array.isArray(item) ? clone(item) : item)
}

module.exports = { makeUsername, makeCode, arrayClone }