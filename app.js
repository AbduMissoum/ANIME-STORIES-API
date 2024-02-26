const express = require('express')
const mongoose = require('mongoose')
const app = express();
const auth = require('./auth/authRoutes');
const home = require('./Routes/storiesRoutes')
const cookie = require('cookie-parser')


app.use(cookie())
require('dotenv').config()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/v1/auth', auth)
app.use('/api/v1/home', home)
app.use((req, res) => {
    res.status(404).json({})
})


















































const port = process.env.PORT || 5000
mongoose.connect(process.env.URL).then(() => {
    app.listen(port, () => {
        console.log("connected to the database and start listening at post 4005..")
    })

}).catch((err) => {
    console.log("can't connect ", err)
})