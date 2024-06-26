const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Appointment Schema
/*This will also be have to updated by alert engine for status. 
appointment id to be passed to alert table while scheduling*/
const Appointment = new Schema({
    patientId: {
        type: mongoose.Types.ObjectId,
        ref: 'Patient',
        requried: true,
    },
    date: {
        type: Date,
        required: true,
    },
    clientId: {
        type: mongoose.Types.ObjectId,
        ref: 'Client',
        required: true,
    },
    alertId: {
        type: mongoose.Types.ObjectId,
        ref: 'Alert',
        required: true,
    },
    status: {
        type: String,
        enum: ['Completed', 'Cancelled', 'Rescheduled', 'Upcoming'],
        default: 'Upcoming',
    }
})


module.exports = mongoose.model('Appointment', Appointment);