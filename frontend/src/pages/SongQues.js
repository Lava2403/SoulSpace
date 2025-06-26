import React, { useState } from 'react';
import axios from 'axios';

const SongQues = () => {
    const [mood, setMood] = useState('');
    const [vibe, setVibe] = useState('');
    const [artistName, setArtistName] = useState('');
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);

    const moodOptions = ['Happy 😊', 'Sad 😢', 'Angry 😠', 'Anxious 😰', 'Excited 🎉', 'Calm 😌', 'Badass 💥', 'Post-breakup 💔', 'Lonely 🌙'];
    const vibeOptions = ['Chill 🧊', 'Energetic ⚡️', 'Dance 💃', 'Soothing 🌊', 'Match my energy 🔥', 'Deep 🎷', 'Upbeat ☀️'];

    const handleFindSongs = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/songrecommend', { mood, vibe, artistName });
            setSongs(response.data.tracks);
        } catch (err) {
            console.error('Error fetching songs:', err);
        }
        setLoading(false);
    };

    const handleSurpriseMe = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/surpriseme');
            setSongs(response.data.tracks);
        } catch (err) {
            console.error('Error fetching surprise songs:', err);
        }
        setLoading(false);
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat"
            style={{ backgroundImage: "url('/images/MusicWaves.jpg')" }}
        >
            <div className="p-8 max-w-5xl mx-auto min-h-screen flex flex-col justify-start items-center">
                <h1 className="text-8xl font-bold mt-20 mb-12 text-center ">Songs of the Day</h1>

                <div className="flex flex-col items-center w-full">
                    {/* Mood and Vibe Dropdowns Side by Side */}
                    <div className="flex flex-wrap justify-center gap-8 mb-8 w-full max-w-4xl">
                        {/* Mood Dropdown */}
                        <div className="min-w-[280px]">
                            <label className="block text-xl font-semibold mb-2">Select Your Mood:</label>
                            <select
                                value={mood}
                                onChange={(e) => setMood(e.target.value)}
                                className="w-full p-4 rounded-2xl border-2 border-gray-400 text-xl"
                            >
                                <option value="">-- Select Mood --</option>
                                {moodOptions.map((m, index) => (
                                    <option key={index} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>

                        {/* Vibe Dropdown */}
                        <div className="min-w-[280px]">
                            <label className="block text-xl font-semibold mb-2">Select Your Vibe:</label>
                            <select
                                value={vibe}
                                onChange={(e) => setVibe(e.target.value)}
                                className="w-full p-4 rounded-2xl border-2 border-gray-400 text-xl"
                            >
                                <option value="">-- Select Vibe --</option>
                                {vibeOptions.map((v, index) => (
                                    <option key={index} value={v}>{v}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Optional Artist */}
                    <div className="mb-8 w-80">
                        <label className="block text-xl font-semibold mb-2">Optional: Favorite Artist</label>
                        <input
                            type="text"
                            value={artistName}
                            onChange={(e) => setArtistName(e.target.value)}
                            placeholder="Artist Name"
                            className="w-full p-4 rounded-2xl border-2 border-gray-400 text-xl"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-6 mb-8">
                        <button
                            onClick={handleFindSongs}
                            className="bg-white text-gray-900 px-8 py-4 rounded-2xl text-2xl hover:scale-105 transition-all"
                        >
                            Find My Songs 
                        </button>
                        <button
                            onClick={handleSurpriseMe}
                            className="bg-blue-950 text-white px-8 py-4 rounded-2xl text-2xl hover:scale-105 transition-all"
                        >
                            Surprise Me 🎲
                        </button>
                    </div>

                    {/* Loader */}
                    {loading && <p className="text-xl text-gray-700 mb-8">Fetching your vibe with AI... 🎶</p>}

                    {/* Display Songs */}
                    {songs.length > 0 && <h2 className="text-3xl font-semibold mb-8 text-center">Your Song Suggestions</h2>}

                    {/* Horizontally Wide Cards */}
                    <div className="flex flex-col gap-6 w-full max-w-4xl">
                        {songs.map((song, index) => (
                            <div
                                key={index}
                                className="bg-white/20 backdrop-blur-md shadow-xl rounded-2xl p-6 flex items-center justify-between"
                            >
                                {/* Song Image and Details */}
                                <div className="flex items-center gap-6">
                                    {song.imageUrl ? (
                                        <img src={song.imageUrl} alt={song.title} className="w-24 h-24 object-cover rounded-xl" />
                                    ) : (
                                        <div className="w-24 h-24 bg-gray-300 rounded-xl flex items-center justify-center text-gray-500">No Image</div>
                                    )}

                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">{song.title}</h3>
                                        <p className="text-lg text-gray-500 font-semibold">{song.artist}</p>
                                    </div>
                                </div>

                                {/* Spotify Button */}
                                <a
                                    href={song.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-black text-green-400 px-6 py-3 rounded-xl border border-green-300 transform transition-transform duration-300 hover:scale-105 shadow-sm"
                                >
                                    Search on Spotify
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SongQues;
