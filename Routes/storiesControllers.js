const { Story, Profile, User } = require('../schema/Schema')
module.exports.get_my_stories = async(req, res) => {
    try {

        const { name } = req.query;
        const query_obj = {}

        if (name) {

            const regex = new RegExp(name, 'i')
            query_obj.name = { $regex: regex }
        }

        query_obj.createdBy = req.id;
        const result = await Story.find(query_obj)
        if (!result) return res.json({})
        const stories = result.map((story) => {

            return { name: story.name, description: story.description, details: story.details, createdAt: story.createdAt }

        })
        res.status(200).json(stories)
    } catch (err) {
        console.log(err)
        res.send(err)
    }


}
module.exports.create_story = async(req, res) => {
    const { name, description, details } = req.body;
    try {

        const story = new Story({ name, description, details, createdBy: req.id })
        await story.save()
        res.status(201).redirect('/api/v1/home/get_my_stories')
    } catch (err) {

        console.log(err)
        res.send(err)
    }



}
module.exports.get_all_stories = async(req, res) => {
    try {
        const { name, } = req.query;
        const obj_query = {}
        if (name) obj_query.name = name;

        const result = await Story.find(obj_query).populate('createdBy')

        const stories = result.map((element) => {
            return {
                name: element.name,
                desription: element.description,
                details: element.details,
                createdBy: element.createdBy.fullName
            }


        })
        return res.json(stories)


    } catch (err) {
        console.log("hhhhh")
        res.send(err)
    }

}

module.exports.get_one_story = async(req, res) => {
    try {
        const story_id = req.params.id;
        const story = await Story.findById(story_id).populate("createdBy")


        if (story) {

            if (req.url.match(/get_all_stories/)) {


                return res.status(200).json({
                    name: story.name,
                    description: story.description,
                    details: story.details,
                    createdBy: story.createdBy.fullName,
                    createdAt: story.createdAt
                })
            } else {
                if (req.id === String(story.createdBy._id)) {
                    return res.status(200).json({
                        name: story.name,
                        description: story.description,
                        details: story.details,
                        createdAt: story.createdAt
                    })

                } else {

                    return res.status(401).json({})

                }

            }

        }

    } catch (err) {
        res.send(err)
    }


}
module.exports.update_story = async(req, res) => {
    try {
        const story_id = req.params.id;
        const { details, description } = req.body;
        await Story.findByIdAndUpdate(story_id, { details: details, description: description })
        if (req.url.match(/get_all_stories/)) return res.status(201).redirect('/api/v1/home/get_all_stories/')
        else return res.status(201).redirect('/api/v1/home/get_my_stories')


    } catch (err) {
        res.send(err)
    }




}

module.exports.delete_story = async(req, res) => {
    try {
        const story_id = req.params.id
        console.log(story_id)
        const result = await Story.findByIdAndDelete(story_id)

        console.log(result)
        console.log('hhhh')
        if (req.url.match(/get_all_stories/)) return res.status(201).redirect('/api/v1/home/get_all_stories/')
        else return res.status(201).redirect('/api/v1/home/get_my_stories')




    } catch (err) {

        res.send(err)
    }


}