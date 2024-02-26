const express = require('express')
const router = express.Router()


const { signup_post, login_post, logout } = require('./authControllers')
    //router.route('/login').post(login_post)
router.route('/signup').get((req, res) => {

    res.send('signup')
}).post(signup_post)
router.route('/login').get((req, res) => { res.send('signin') }).post(login_post)
router.route('/').get((req, res) => { res.send('loginnnn or signup') })
router.get('/logout', logout)
router.use((req, res) => {
    res.status(404).json({})
})

module.exports = router