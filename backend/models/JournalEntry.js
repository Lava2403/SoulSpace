// models/JournalEntry.js
const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  content: { type: String, required: true }
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
