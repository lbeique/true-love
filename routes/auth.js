const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser")
const database = require("../databaseAccess")
const { makeCode } = require('../server/handlers')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(express.static("public"))

const getSession = (session) => {
  if (!session.authenticated) {
    return null
  }
  return session
}


router.get("/login", (req, res) => {
  req.session.authenticated = true;
  req.session.user_info = {}
  req.session.user_info.user_name = makeCode(8)
  req.session.user_info.user_id = Math.floor(Math.random() * 1000)
  req.session.user_info.total_points = Math.floor(Math.random() * 2)
  const session = getSession(req.session)
  console.log('get login session', session)
  if (!session) {
    res.status(200).render('loginForm')
    return
  }
  res.status(200).redirect('/mainmenu')
  return
})

router.post("/login", async (req, res) => {
  const session = getSession(req.session)
  console.log('post login session', session)
  if (!session) {
    const user_info = await database.getUserByLogin(req.body)
    console.log('route', user_info)
    if (!user_info) {
      console.log('Error with login')
      res.status(404).redirect('/auth/login')
      return
    }
    req.session.user_info = {}
    req.session.user_info.user_name = user_info.user_name
    req.session.user_info.user_id = +user_info.user_id
    req.session.user_info.total_points = +user_info.total_points
    res.status(200).redirect('/')
    return
  }
  console.log('Error with login')
  res.status(404).redirect('/')
  return
})

router.get("/signup", (req, res) => {
  const session = getSession(req.session)
  console.log('get signup session', session)
  if (!session) {
    res.status(200).render('signUpForm')
    return
  }
  res.status(200).redirect('/lobby')
  return
})

router.post("/signup", async (req, res) => {
  const session = getSession(req.session)
  console.log('post signup session', session)
  if (!session) {
    if (!req.body) {
      console.log('Signup form is empty')
      res.status(400).redirect('/auth/signup')
      return
    }
    if (!req.body.name) {
      console.log('Signup form is missing name')
      res.status(400).redirect('/auth/signup')
      return
    }
    if (!req.body.email) {
      console.log('Signup form is missing email')
      res.status(400).redirect('/auth/signup')
      return
    }
    if (!req.body.password) {
      console.log('Signup form is missing password')
      res.status(400).redirect('/auth/signup')
      return
    }
    const user_info = await database.addUser(req.body)
    console.log('signup route db result', user_info)
    if (!user_info) {
      console.log('Signup error')
      res.status(400).redirect('/auth/signup')
      return
    }
    req.session.user_info = {}
    req.session.user_info.user_name = user_info.name
    req.session.user_info.user_id = +user_info.user_id
    req.session.user_info.total_points = +user_info.total_points
    res.status(200).redirect('/')
    return
  }
  res.status(404).redirect('/')
  return
})

router.get("/logout", (req, res) => {
  req.session = null
  res.redirect("/")
  return
})

router.use((req, res) => {
  res.status(404).send({ error: "This isn't a valid address." })
  return
})

router.use((err, req, res, next) => {
  if (res.headersSent) {
    return (next(err))
  }
  console.log('500', err)
  res.status(500).send({ error: "Something bad happened to the server. :shrug:" })
  return
})

module.exports = router