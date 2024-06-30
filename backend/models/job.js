const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageJob = new Schema({
    id: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    oneDayJobId: { type: String, required: true },
    oneHourJobId: { type: String, required: true },
    message: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    status: {
        type: String,
        enum: ['sent', 'cancelled', 'rescheduled', 'failed', 'upcoming'],
        default: 'upcoming',
    }
});

module.exports = mongoose.model('messageJob', messageJob);
