require('dotenv').config();

const express = require('express');
const router = express.Router();
const axios = require('axios');
const { GEMINI_API_KEY } = require('../config/ai');

router.post('/songrecommend', async (req, res) => {
  console.log('🎵 API called - /songrecommend');
  const { mood, vibe, artistName } = req.body;

  if (!mood || !vibe) {
    return res.status(400).json({ error: 'Please provide both mood and vibe.' });
  }

  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let prompt = `Suggest 5 songs that match the mood: ${mood} and vibe: ${vibe}. Format each like:\n\n1. Song Name - Artist Name`;

    if (artistName && artistName.trim() !== '') {
      prompt = `Suggest 5 songs by ${artistName} that match the mood: ${mood} and vibe: ${vibe}. Format each like:\n\n1. Song Name - Artist Name`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiText = response.text();

    console.log('🎶 Gemini AI Response:', aiText);

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
    console.error('🎤 Gemini Song API Error:', err.message || err);
    return res.status(500).json({ error: 'Failed to generate Gemini song suggestions.' });
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

       const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const result = await model.generateContent(prompt);
const response = await result.response;
const aiText = response.text();


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
