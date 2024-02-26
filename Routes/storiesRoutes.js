const express = require('express')
const router = express.Router()
const { authenticate, auth_update_or_delete } = require('../auth/authControllers')
const { create_story, get_my_stories, get_all_stories, get_one_story, update_story, delete_story } = require('./storiesControllers')

router.route('/').all(authenticate).get((req, res) => { res.send('hhhhh') })
router.route('/get_my_stories').all(authenticate).get(get_my_stories).post(create_story)
router.route('/get_all_stories').all(authenticate).get(get_all_stories)
router.route('/get_all_stories/search').all(authenticate).get(get_all_stories)
    //searching by name and createdBy 
router.route('/get_all_stories/:id').all(authenticate).get(get_one_story)
router.route('/get_my_stories/search').all(authenticate).get(get_my_stories)

router.route('/get_my_stories/:id').all(authenticate).get(get_one_story).patch(auth_update_or_delete, update_story).delete(auth_update_or_delete, delete_story)
router.use((req, res) => {
    res.status(404).json({})
})



module.exports = router