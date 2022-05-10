// Get all questions right or wrong

// Your status compared to other people

// Position on leaderboard

// Difference between your current position and previous position

// Special point number

// A lot of errors (brute force)

// No errors (hot streak)

// did first place vote for crush?


// How close is the game function (returns number between 0-5)
function howCloseIsGameCalculator(leaderboard) {
    if (leaderboard.length > 1) {
        return pointDifference = leaderboard[0].points - leaderboard[1].points
    }
}

// Returns the highest streak object { username: 'bob', streak: ( number between 2 - 20) }
function firstTriviaStreakCalculator(players) {
    let maxStreaks = []
    for (const player in players) {
        let errors = players[player].game.trivia.easy.errors
        let currentStreak = 0
        let highestStreak = 0
        for (const error of errors) {
            if (error === 0) {
                currentStreak++
            } else {
                if (currentStreak > highestStreak) {
                    highestStreak = currentStreak
                    currentStreak = 0
                }
                currentStreak = 0
            }
        }
        if (currentStreak > highestStreak) {
            highestStreak = currentStreak
        }
        maxStreaks.push({ username: player.username, streak: highestStreak })
    }
    maxStreaks.sort((b, a) => (a.streak > b.streak) ? 1 : ((b.streak > a.streak) ? -1 : 0))
    return maxStreaks[0]
}

// Returns the highest streak object { username: 'bob', streak: ( number between 2 - 15) }
function secondTriviaStreakCalculator(players) {
    let maxStreaks = []
    for (const player in players) {
        let errors = players[player].game.trivia.medium.errors
        let currentStreak = 0
        let highestStreak = 0
        for (const error of errors) {
            if (error === 0) {
                currentStreak++
            } else {
                if (currentStreak > highestStreak) {
                    highestStreak = currentStreak
                    currentStreak = 0
                }
                currentStreak = 0
            }
        }
        if (currentStreak > highestStreak) {
            highestStreak = currentStreak
        }
        maxStreaks.push({ username: player.username, streak: highestStreak })
    }
    maxStreaks.sort((b, a) => (a.streak > b.streak) ? 1 : ((b.streak > a.streak) ? -1 : 0))
    return maxStreaks[0]
}


// The analytics function used to generate dialogue in lounge phase. 
// Returns an array of dialogues to be used in the front end

function analytics(room, leaderboard) {

    let firstLeaderboard = null
    let secondLeaderboard = null

    if (!firstLeaderboard) {
        firstLeaderboard = leaderboard
    } else if (!secondLeaderboard) {
        secondLeaderboard = leaderboard
    } else {
        firstLeaderboard = null
        secondLeaderboard = null
        //room = null
        return
    }

    function createDialogue() {
        let dialogue = []
        let players = room.clients
        if (!secondLeaderboard) {
            dialogue.push(`${firstLeaderboard[0].username} has taken an early lead with a total of ${firstLeaderboard[0].points} points`)
            if (firstLeaderboard.length > 1) {
                dialogue.push(`${firstLeaderboard[firstLeaderboard.length - 1].username} is dead sexy, in last place!`)
            }
            let howCloseIsGame = howCloseIsGameCalculator(firstLeaderboard)
            if (howCloseIsGame <= 5) {
                if (howCloseIsGame === 0) {
                    dialogue.push(`I can't believe it! The game is tied.`)
                } else {
                    dialogue.push(`What a close game! ${firstLeaderboard[0].username} is only ${howCloseIsGame} points ahead of ${firstLeaderboard[0].username}!`)
                }
            }
            let firstTriviaStreak = firstTriviaStreakCalculator(players)
            if (firstTriviaStreak.streak > 2) {
                if (firstTriviaStreak.streak === 20) {
                    dialogue.push(`OMG!! ${firstTriviaStreak.username} has a perfect game!!!`)
                } else {
                    dialogue.push(`${firstTriviaStreak.username} sure is hot! They answered ${firstTriviaStreak.streak} questions correctly in a row!`)
                }
            }
        } else {
            dialogue.push(`${secondLeaderboard[0].username} is currently in the lead with ${secondLeaderboard[0].points} points`)
            if (secondLeaderboard.length > 1) {
                dialogue.push(`You can do it! ${secondLeaderboard[secondLeaderboard.length - 1].username} I believe in you!`)
            }
            let howCloseIsGame = howCloseIsGameCalculator(secondLeaderboard)
            if (howCloseIsGame <= 5) {
                if (howCloseIsGame === 0) {
                    dialogue.push(`This is incredible! The game is all tied up with only one round to go!`)
                } else {
                    dialogue.push(`After two rounds, ${secondLeaderboard[0].username} and ${secondLeaderboard[0].username} are only ${howCloseIsGame} points apart!`)
                }
            }
            let secondTriviaStreak = secondTriviaStreakCalculator(players)
            if (secondTriviaStreak.streak > 2) {
                if (secondTriviaStreak.streak === 20) {
                    dialogue.push(`Unbelievably, ${secondTriviaStreak.username} managed to get all questions in the second round on their first try!`)
                } else {
                    dialogue.push(`Look out! ${secondTriviaStreak.username} had a hotstreak of ${secondTriviaStreak.streak} correct guesses in a row!`)
                }
            }
        }
        return dialogue
    }
    return createDialogue
}

module.exports = { analytics }