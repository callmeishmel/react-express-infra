const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    msg: String,
    created: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Message', MessageSchema);