const express = require('express');
const router = express.Router();
const JournalEntry = require('../models/JournalEntry');

// ✅ GET all entries for a user
router.get('/', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId in query' });
  }

  try {
    const entries = await JournalEntry.find({ user: userId }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    console.error('Error fetching journal entries:', err);
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
});

// ✅ POST a new journal entry
router.post('/', async (req, res) => {
  const { userId, date, content } = req.body;

  if (!userId || !date || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newEntry = await JournalEntry.create({
      user: userId,
      date,
      content
    });
    res.status(201).json(newEntry);
  } catch (err) {
    console.error('Error saving journal entry:', err);
    res.status(500).json({ error: 'Failed to save journal entry' });
  }
});


// ✅ PUT: Update an entry by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Missing content' });
  }

  try {
    const updated = await JournalEntry.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('Error updating entry:', err);
    res.status(500).json({ error: 'Failed to update entry' });
  }
});


// ✅ DELETE: Remove an entry by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await JournalEntry.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting entry:', err);
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});


module.exports = router;
