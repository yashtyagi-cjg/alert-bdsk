const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Patient Schema
//Patient Details etc are stored here
const Patient = new Schema({
    clientId: {
        type: mongoose.Types.ObjectId, 
        ref: 'Client',
        required: true,
    }, 
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true,
    }
})

//To get the full name of the patient without storing it in db
Patient.virtual('name').get(function() {
    return `${this.firstName} ${this.lastName}`;
});


module.exports = mongoose.model('Patient', Patient)