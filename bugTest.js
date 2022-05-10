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
        if (room.gameState.triviaIndex === 0) {
                user.game.trivia.easy.animate[userProgressIndex] = 1
            if (!errors) {
                user.game.trivia.easy.errors.push(1)
            } else {
                user.game.trivia.easy.errors[userProgressIndex]++
            }
        } else if (room.gameState.triviaIndex === 1) {
                user.game.trivia.medium.animate[userProgressIndex] = 1
            if (!errors) {
                user.game.trivia.medium.errors.push(1)
            } else {
                user.game.trivia.medium.errors[userProgressIndex]++
            }
        } else if (room.gameState.triviaIndex === 2) {
                user.game.trivia.hard.animate[userProgressIndex] = 1
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
        if (!errors) {
            user.game.trivia.easy.errors.push(0)
            points = points + 5
        } else if (errors === 1) {
            points = points + 3
        } else if (errors >= 2) {
            points = points + 1
        }
        user.game.totalPoints = user.game.totalPoints + points
        if (room.gameState.triviaIndex === 0) {
            user.game.trivia.easy.points = points
            user.game.trivia.easy.progressIndex++
            user.game.trivia.easy.questions.push(clientTriviaQuestions[user.game.trivia.easy.progressIndex])

        } else if (room.gameState.triviaIndex === 1) {
            user.game.trivia.medium.points = points
            user.game.trivia.medium.progressIndex++
            user.game.trivia.medium.questions.push(clientTriviaQuestions[user.game.trivia.medium.progressIndex])

        } else if (room.gameState.triviaIndex === 2) {
            user.game.trivia.hard.points = points
            user.game.trivia.hard.progressIndex++
            user.game.trivia.hard.questions.push(clientTriviaQuestions[user.game.trivia.hard.progressIndex])

        }
        const data = {
            points: points,
            result: true,
            errors: errors,
        }
        return data
    }
}