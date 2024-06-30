const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageJob = new Schema({
    id: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    oneDayJobId: { type: String, required: true },
    oneHourJobId: { type: String, required: true }
});

module.exports = mongoose.model('messageJob', messageJob);
