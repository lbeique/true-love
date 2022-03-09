const database = require("../databaseConnection");
const fs = require("fs");

class Trivia {

    #totalGuesses;
    #completed = false;
    #id;
    #answer;
    #question;
    #prompts;

    constructor(question) {
        this.#id = question.id;
        this.#totalGuesses = 3;
        this.#answer = question.answer;
        this.#question = question.question;
        this.#prompts = question.prompts;
    }

    static random(callback) {
        fs.readFile("./trivia/trivia.json", "utf-8", (error, result) => {
            if (error) {
                callback(error, null);
            } else {
                let parsedTrivia = JSON.parse(result);
                let question = parsedTrivia.questions[Math.floor(Math.random() * parsedTrivia.questions.length)];
                callback(null, new Trivia(question));
            }
        });
    }

    guess(prompt) {
        if (prompt === this.#answer) {
            // this.#totalGuesses++;
            this.#completed = true;
        } else {
            this.#totalGuesses--;
        }
    }

    get answer() {
        return this.#answer;
    }

    get completed() {
        return this.#completed;
    }

    get totalGuesses() {
        return this.#totalGuesses;
    }

    get question() {
        return this.#question;
    }

    get prompts() {
        return this.#prompts;
    }

    get id() {
        return this.#id;
    }
}

// let trivia = Trivia.random()
// console.log(trivia.question);
// console.log(trivia.prompts);
// console.log(1);
// trivia.guess(1);
// console.log(trivia.completed);

module.exports = Trivia