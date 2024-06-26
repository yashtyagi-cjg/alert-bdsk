const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Auth Schema
//If later we pivot to mircoservice. Let's revamp this to JWT
const Auth = new Schema({
    username: {
        type: String,
        required: true,
    },
    salt: {
        type: String, 
        required: true,
    },
    clientId: {
        type: mongoose.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    hash: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Auth', Auth);