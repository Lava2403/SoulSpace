const express = require('express');
const router = express.Router();
const GratitudeNote = require('../models/GratitudeNote'); // ✅ Correct import

// Get all notes
router.get('/', async (req, res) => {
    try {
        const notes = await GratitudeNote.find();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

// Add new note
router.post('/', async (req, res) => {
    console.log('POST request received at /api/gratitude'); // ✅ Add this line
    console.log('Request Body:', req.body); // ✅ Add this line to verify incoming data

    const { text, color } = req.body;

    try {
        const newNote = new GratitudeNote({ text, color });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add note' });
    }
});


// Update note
router.put('/:id', async (req, res) => {
    const { text } = req.body;
    try {
        const updatedNote = await GratitudeNote.findByIdAndUpdate(
            req.params.id,
            { text },
            { new: true }
        );
        res.json(updatedNote);
    } catch (err) {
        res.status(500).json({ message: 'Error updating note' });
    }
});

// Delete note
router.delete('/:id', async (req, res) => {
    try {
        await GratitudeNote.findByIdAndDelete(req.params.id);
        res.json({ message: 'Note deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

module.exports = router;
