const database = require("../databaseConnection");

class Trivia {

    #totalGuesses = 0;
    #completed = false;
    #answer;
    #question;
    #prompts;
    
    constructor(question) {
        this.#answer = question.answer;
        this.#question = question.question;
        this.#prompts = question.prompts;
    }

    static random() {
        let questions = [{
            question: "How many ducks are in a goose?",
            prompts: [1, 2, 3],
            answer: 2
        },
        {
            question: "How many beers can you drink?",
            prompts: [1, 2, 3],
            answer: 3
        },
        {
            question: "What is the average velocity of a North African Swallow?",
            prompts: [1, 2, 3],
            answer: 1
        },
        {
            question: "What time is it?",
            prompts: [1, 2, 3],
            answer: 2
        },
        {
            question: "Which of these numbers is a number one?",
            prompts: [1, 2, 3],
            answer: 1
        }]
        let question = questions[Math.floor(Math.random()*questions.length)]
        return new Trivia(question)
    }

    guess(prompt) {
        if (prompt === this.#answer) {
            this.#totalGuesses++;
            this.#completed = true;
        } else {
            this.#totalGuesses++;
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
}

let trivia = Trivia.random()
console.log(trivia.question);
console.log(trivia.prompts);
console.log(1);
trivia.guess(1);
console.log(trivia.completed);

module.exports = Trivia