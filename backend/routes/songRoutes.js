const express = require('express');
const router = express.Router();
const axios = require('axios');
const { OPENROUTER_API_KEY } = require('../config/ai');

// 🎧 AI-based Song Recommendation API
router.post('/songrecommend', async (req, res) => {
    console.log('🎵 API called - /songrecommend');
    console.log('Request Body:', req.body);

    const { mood, vibe, artistName } = req.body;

    if (!mood || !vibe) {
        return res.status(400).json({ error: 'Please provide both mood and vibe.' });
    }

    try {
        let prompt = `Suggest 5 songs that fit the mood: ${mood} and vibe: ${vibe}. Format each song as:\n\nSong Name - Artist Name`;

        if (artistName && artistName.trim() !== '') {
            prompt = `Suggest 5 songs by ${artistName} that fit the mood: ${mood} and vibe: ${vibe}. Format each song as:\n\nSong Name - Artist Name`;
        }

        const aiResponse = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'mistralai/mistral-7b-instruct',
            messages: [{ role: 'user', content: prompt }]
        }, {
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const aiText = aiResponse.data.choices[0].message.content;

        console.log('📝 AI Response:', aiText);

        const songs = aiText
            .split('\n')
            .map(line => line.trim())
            .filter(line => /^\d+\.\s.+\s-\s.+$/.test(line))
            .map(line => {
                const [songPart, artistPart] = line.replace(/^\d+\.\s*/, '').split(' - ').map(part => part.trim());
                return {
                    title: songPart,
                    artist: artistPart,
                    url: `https://open.spotify.com/search/${encodeURIComponent(songPart + ' ' + artistPart)}`
                };
            });

        const tracksWithImages = await Promise.all(
            songs.map(async (song) => {
                try {
                    const iTunesResponse = await axios.get('https://itunes.apple.com/search', {
                        params: { term: `${song.title} ${song.artist}`, media: 'music', limit: 1 }
                    });

                    const imageUrl = iTunesResponse.data.results[0]?.artworkUrl100 || '/images/fallback1.jpg';

                    return { ...song, imageUrl };
                } catch (error) {
                    console.error('Error fetching image from iTunes:', error.message);
                    return { ...song, imageUrl: '/images/fallback1.jpg' };
                }
            })
        );

        return res.json({ tracks: tracksWithImages });

    } catch (err) {
        console.error('Error fetching AI song suggestions:', err.response?.data || err.message);
        return res.status(500).json({ error: err.response?.data || err.message });
    }
});

// 🎲 Surprise Me API
router.get('/surpriseme', async (req, res) => {
    try {
        const moods = ['Happy 😊', 'Sad 😢', 'Chill 🧘‍♀️', 'Excited 🤩', 'Romantic 💕', 'Reflective 🤔', 'Badass 😎', 'Post Breakup 💔'];
        const vibes = ['Calm 🌊', 'Energetic ⚡', 'Soothing ☁️', 'Intense 🔥', 'Dreamy 🌙', 'Vibey 🎧'];

        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        const randomVibe = vibes[Math.floor(Math.random() * vibes.length)];

        const prompt = `Suggest 5 songs that fit the mood: ${randomMood} and vibe: ${randomVibe}. Format each song as:\n\nSong Name - Artist Name`;

        const aiResponse = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'mistralai/mistral-7b-instruct',
            messages: [{ role: 'user', content: prompt }]
        }, {
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const aiText = aiResponse.data.choices[0].message.content;

        console.log('📝 AI Response (Surprise Me):', aiText);

        const songs = aiText
            .split('\n')
            .map(line => line.trim())
            .filter(line => /^\d+\.\s.+\s-\s.+$/.test(line))
            .map(line => {
                const [songPart, artistPart] = line.replace(/^\d+\.\s*/, '').split(' - ').map(part => part.trim());
                return {
                    title: songPart,
                    artist: artistPart,
                    url: `https://open.spotify.com/search/${encodeURIComponent(songPart + ' ' + artistPart)}`
                };
            });

        const tracksWithImages = await Promise.all(
            songs.map(async (song) => {
                try {
                    const iTunesResponse = await axios.get('https://itunes.apple.com/search', {
                        params: { term: `${song.title} ${song.artist}`, media: 'music', limit: 1 }
                    });

                    const imageUrl = iTunesResponse.data.results[0]?.artworkUrl100 || '/images/fallback1.jpg';

                    return { ...song, imageUrl };
                } catch (error) {
                    console.error('Error fetching image from iTunes:', error.message);
                    return { ...song, imageUrl: '/images/fallback1.jpg' };
                }
            })
        );

        return res.json({ tracks: tracksWithImages });

    } catch (err) {
        console.error('Error fetching surprise songs:', err.response?.data || err.message);
        return res.status(500).json({ error: err.response?.data || err.message });
    }
});

module.exports = router;
