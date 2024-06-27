const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Client Collection Definition
//Contraint applied such that currentCounter < messageLimit. So, client can only use allocated quota.
const Client = new Schema({
    name: {
        type: String, 
        required: true
    },
    // doctor_firstName: {
    //     type: String, 
    //     required: true
    // },
    // doctor_lastName: {
    //     type: String,
    //     required: true,
    // },
    messageLimit: {
        type: Number, 
        required: true
    },
    currentCounter: {
        type: Number,
        required: true,
        validate: {
            validator: function(v){
                return v <= this.messageLimit;
            }
        }
    },
    phoneNumber: {
        type: String, 
        required: true
    },
    assets: {type: Map,
        of: String
    },
})

module.exports = mongoose.model('Client', Client);