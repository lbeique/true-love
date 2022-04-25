const fs = require("fs").promises

class Trivia {

    #remainingGuesses
    #completed = false
    #id
    #answer
    #question
    #prompts
    #point_value

    constructor(question) {
        this.#id = question.id
        this.#remainingGuesses = 3
        this.#answer = question.answer
        this.#question = question.question
        this.#prompts = question.prompts
        this.#point_value = 0
    }

    static async random() {
        const result = await fs.readFile("./trivia/trivia.json", "utf-8")
        let parsedTrivia = JSON.parse(result)
        let question = parsedTrivia.questions[Math.floor(Math.random() * parsedTrivia.questions.length)]
        return new Trivia(question)
    }



    guess(prompt) {
        if (prompt === this.#answer) {
            if (this.#remainingGuesses === 3) {
                this.#point_value = 5
            } else if (this.#remainingGuesses === 2) {
                this.#point_value = 3
            } else if (this.#remainingGuesses === 1) {
                this.#point_value = 2
            } else if (this.#remainingGuesses === 0) {
                this.#point_value = 1
            }
            this.#completed = true
        } else {
            this.#remainingGuesses--
        }
    }

    get answer() {
        return this.#answer
    }

    get completed() {
        return this.#completed
    }

    get remainingGuesses() {
        return this.#remainingGuesses
    }

    get question() {
        return this.#question
    }

    get point_value() {
        return this.#point_value
    }

    get prompts() {
        return this.#prompts
    }

    get id() {
        return this.#id
    }
}

// let trivia = Trivia.random()
// console.log(trivia.question)
// console.log(trivia.prompts)
// console.log(1)
// trivia.guess(1)
// console.log(trivia.completed)

module.exports = Trivia