const mongoose = require('mongoose');

const GratitudeNoteSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('GratitudeNote', GratitudeNoteSchema);
