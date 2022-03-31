const express = require('express')
const router = express.Router();
const bodyParser = require("body-parser")
const db = require("../databaseAccess");
const database = require("../databaseConnection");
const newTrivia = require("../trivia/trivia"); // when we 'play game' from lobby, we want a new trivia question, not the same one
let trivia; // keep the trivia question for this round until player hits play game in lobby. Doesn't work with trivia = newTrivia  

router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.static("public"))

const getSession = (session) => {
    if (session.user_name) {
        return session;
    } else {
        return null;
    }
}

router.get("/", (req, res) => {
    let user = getSession(req.session);
    if (user) {
        const newGame = +req.query.newGame;
        if (newGame === 0) {
            newTrivia.random((error, result) => {
                if (error) {
                    console.error(error);
                    res.status(500).redirect("/");
                }
                trivia = result;
                res.status(200).render("trivia", { trivia, user })
            });
        } else {
            res.status(200).render("trivia", { trivia, user })
        }
    } else {
        res.status(300).redirect('/');
    }
})

router.post("/", async (req, res) => {
    let user = getSession(req.session);
    const UserAnswer = req.body;
    console.log(UserAnswer.prompt);
    trivia.guess(UserAnswer.prompt);
    if (trivia.completed) {
        const points = trivia.point_value
        database.getConnection(function (err, dbConnection) {
            if (err) {
              res.status(500).render('error', { message: 'Error connecting to MySQL' });
              console.log("Error connecting to mysql");
              console.log(err);
            } else {
              db.updateUserPoints(user.user_id, points, (err, result) => {
                if (err) {
                  res.status(500).render('error', { message: 'Error reading from MySQL' });
                  console.log("Error reading from mysql");
                  console.log(err);
                } else { //success
                  console.log('user points updated');
                }
              })
            }
          })
    }
    res.status(200).render("triviaResult", { trivia, user })
})



module.exports = router;