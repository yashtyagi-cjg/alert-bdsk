const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Doctor Collection Definition
const Doctor = new Schema({
    firstName: {
        type: String, 
        required: true
    },
    lastName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    clientId: {
        type: mongoose.Types.ObjectId,
        ref: 'Client',
        required: true,
    }
})

module.exports = mongoose.model('Doctor', Doctor);