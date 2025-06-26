const express = require('express');
const Favourite = require('../models/Favourite');

const router = express.Router();

// Save favorite quote
router.post('/', async (req, res) => {
    try {
        const { userId, quote, author } = req.body;

        if (!userId || !quote || !author) {
            return res.status(400).json({ message: 'Missing fields' });
        }

        const existingFavorite = await Favourite.findOne({ userId, quote, author });

        if (existingFavorite) {
            return res.status(200).json({ message: 'Quote already in favorites.' }); // Respond silently
        }

        const newFavorite = new Favourite({
            userId,
            quote,
            author
        });

        await newFavorite.save();

        console.log('Favourite saved successfully:', newFavorite); // ✅ Log here

        res.status(200).json({ message: 'Quote saved to favourites.' });
    } catch (err) {
        console.error('Error saving favourite:', err);
        res.status(500).json({ message: 'Failed to save favourite.' });
    }
});

// Get favorites for a user
router.get('/:userId', async (req, res) => {
    try {
        const favourites = await Favourite.find({ userId: req.params.userId });
        res.status(200).json(favourites);
    } catch (err) {
        console.error('Error fetching favourites:', err);
        res.status(500).json({ message: 'Failed to fetch favourites.' });
    }
});

// DELETE a favorite quote
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Favourite.findByIdAndDelete(id);
        res.status(200).json({ message: 'Quote removed from favourites.' });
    } catch (err) {
        console.error('Error removing favourite:', err);
        res.status(500).json({ message: 'Failed to remove favourite.' });
    }
});

// Delete favorite based on userId, quote, and author
router.delete('/remove', async (req, res) => {
    try {
        const { userId, quote, author } = req.body;

        if (!userId || !quote || !author) {
            return res.status(400).json({ message: 'Missing fields' });
        }

        const deletedFavourite = await Favourite.findOneAndDelete({ userId, quote, author });

        if (!deletedFavourite) {
            return res.status(404).json({ message: 'Favourite not found.' });
        }

        res.status(200).json({ message: 'Favourite removed successfully.' });
    } catch (err) {
        console.error('Error removing favourite:', err);
        res.status(500).json({ message: 'Failed to remove favourite.' });
    }
});



module.exports = router;
