const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Alert Schema
//This will store alerts and their schedule times. It will be used for Scheduler to send out messages
//Note: Didn't add patient details as specified in diagram as they can be fetched when fetching Alert document with .populate()
const Alert = new Schema({
    clientId: {
        type: mongoose.Types.ObjectId,
        ref: 'Client',
        required: true,
    },
    patientId: {
        type: mongoose.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    timeSent: {
        type: Date,
    },
    timeCreated: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Sent', 'Cancelled', 'Upcoming'],
    },
    message: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Alert', Alert);