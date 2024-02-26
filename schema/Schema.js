const mongoose = require("mongoose")
const bcrypt = require('bcrypt')

const User_schema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username not provided "],

    },
    password: {

        type: String,
        required: [true, "password not provided "],

        minlength: [6, "password less than 6 caracters"]
    },
    role: {
        type: String,
        required: true,
        default: "basic"
    }


}, { timestamps: true })

const storySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,

    },
    details: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "profile"

    },
    image_path: {
        type: String
    }




}, { timestamps: true })


const profileSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true

    },
    photo_path: {

        type: String,

    },




}, {
    timestamps: true
})























User_schema.pre('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        console.error("Error hashing password:", error);
    }
    next();
});







const User = mongoose.model("user", User_schema)
const Story = mongoose.model('story', storySchema)
const Profile = mongoose.model('profile', profileSchema)




module.exports = { User, Story, Profile }