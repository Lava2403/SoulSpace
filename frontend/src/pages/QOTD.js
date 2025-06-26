import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQuote } from '../context/QuoteContext';

const QOTD = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const { quoteData, setQuoteData } = useQuote();
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (!quoteData) {
            fetchQuote();
        } else {
            // Check if the current quote is already liked for this session (optional)
            setIsFavorite(false); // Reset heart on new quote load
        }
    }, []);

    const fetchQuote = async () => {
        try {
            const response = await axios.get('https://api.realinspire.live/v1/quotes/random');
            const newQuote = response.data[0];
            setQuoteData(newQuote);
            setIsFavorite(false); // Always start as unliked for new quotes
        } catch (error) {
            console.error('Error fetching quote:', error);
        }
    };

    const handleFavorite = async () => {
        if (!user) {
            alert('Please log in to manage favourites.');
            return;
        }

        if (isFavorite) return; // Do nothing if already liked

        try {
            await axios.post('http://localhost:5000/api/favourites', {
                userId: user._id,
                quote: quoteData.content,
                author: quoteData.author
            }, { withCredentials: true });

            setIsFavorite(true); // Heart turns red on first click
        } catch (err) {
            console.error('Error updating favourite:', err);
        }
    };

    if (loading || !quoteData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <h2 className="text-2xl font-semibold">Loading...</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-4" style={{ backgroundImage: "url('/images/Sunflower2.jpg')" }}>
            <div className="bg-white bg-opacity-80 p-6 rounded-2xl shadow-lg text-center max-w-xl w-full">
                <h2 className="text-3xl font-bold mb-4">Quote of the Day</h2>
                <h1 className="text-2xl font-semibold mb-4 text-gray-700">"{quoteData.content}"</h1>
                <p className="text-lg mb-6">- {quoteData.author}</p>
                <div className="flex justify-center space-x-4">
                    <button onClick={fetchQuote} className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">New Quote</button>
                    <button
                        onClick={handleFavorite}
                        className={`text-2xl ${isFavorite ? 'text-red-500' : 'text-gray-400'} hover:scale-110 transition-transform duration-300`}
                    >
                        <FaHeart />
                    </button>
                    <button onClick={() => navigate('/favourites')} className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">Favourites</button>
                </div>
            </div>
        </div>
    );
};

export default QOTD;
