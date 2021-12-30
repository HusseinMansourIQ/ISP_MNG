const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    userEname: {
        type: String,
    },
    user_name: {
        type: String,
    },
    left_deb: {
        type: String,
        required: true
    },
    am_paid: {
        type: String,
        required: true
    },
    am_type: {
        type:String,
        required: true
    },
    note: {
        type: String,
        required: true
    },
    created_at:{
        type: Date
    },
    mng:{
        type : String
    }

})

let Event = mongoose.model('Users_debs', userSchema, 'Users_debs')

module.exports = Event