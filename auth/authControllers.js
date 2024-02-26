const { Profile, User, Story } = require('../schema/Schema')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
module.exports.signup_post = async(req, res) => {
    try {
        const { fullName, username, password } = req.body;
        if (!fullName || !username || !password) return res.status(401).json({ msg: "bad request" })
        const user = new User({ username, password })
        const result = await user.save()
        const profile = new Profile({ fullName, _id: user._id })
        const result_profile = await profile.save()
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET, { expiresIn: 24 * 60 * 60 })

        res.cookie('jwt', token, { maxAge: 24 * 60 * 60, httpOnly: true })
        res.status(201).json({ token: token, profile })

    } catch (err) {
        res.send(err)
    }
}


module.exports.login_post = async(req, res) => {
    const { username, password } = req.body;
    try {
        console.log(username)
        const result = await User.find({ username })
        console.log(result)
        if (!result) return res.status(404).redirect('/api/v1/auth')

        for (let i = 0; i < result.length; i++) {
            const isValid = await bcrypt.compare(password, result[i].password)


            if (isValid) {

                const token = jwt.sign({ username, role: result[i].role, id: result[i]._id }, process.env.SECRET, { expiresIn: '2h' })
                res.cookie('jwt', token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true })
                return res.status(200).redirect('/api/v1/home')

            }

        }

        return res.status(404).redirect('/api/v1/auth')
    } catch (err) {
        res.send(err)


    }
}
module.exports.authenticate = async(req, res, next) => {

    const token = req.cookies.jwt;
    if (!token) return res.redirect('/api/v1/auth')
    jwt.verify(token, process.env.SECRET, (err, decoded) => {

        if (err) {
            return res.redirect('/api/v1/auth')
        }

        req.id = decoded.id
        req.username = decoded.username
        next()


    })






}

module.exports.logout = (req, res) => {

    res.cookie('jwt', '', { maxAge: 1 })
    res.redirect('/api/v1/auth')


}
module.exports.auth_update_or_delete = async(req, res, next) => {

    const token = req.cookies.jwt;
    if (!token) return res.redirect('/api/v1/auth')
    jwt.verify(token, process.env.SECRET, async(err, decoded) => {

        if (err) {
            return res.redirect('/api/v1/auth')
        }
        if (decoded.role === 'admin') {
            req.id = decoded.id
            req.username = decoded.username
            next()

        } else {
            const story = await Story.findById(req.params.id)


            if (story) {
                if (String(story.createdBy) === decoded.id) {
                    console.log(String(story.createdBy))
                    req.id = decoded.id
                    req.username = decoded.username
                    next()
                } else res.status(401).redirect('/api/v1/home/get_all_stories')
            } else res.status(401).redirect('/api/v1/home/get_all_stories')

        }


    })




}