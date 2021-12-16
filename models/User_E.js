const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    userEname: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    user_deb: {
        type: String,
        required: true
    },
    user_note: {
        type: String,
        required: true
    },
    created_at:{
        type: Date
    }

})

let Event = mongoose.model('Users', userSchema, 'Users')

module.exports = Event