const express = require("express");
const bodyParser = require("body-parser")

const app = express();

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const signUpRouter = require('./routes/signup');

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/signup', signUpRouter);

app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }));

module.exports = app;