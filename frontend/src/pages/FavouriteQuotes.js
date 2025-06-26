import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaHeart } from 'react-icons/fa';

const Favourites = () => {
    const { user } = useAuth();
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchFavourites();
        }
    }, [user]);

    const fetchFavourites = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/favourites/${user._id}`);
            setFavourites(res.data);
        } catch (err) {
            console.error('Error fetching favourites:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavourite = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/favourites/${id}`, { withCredentials: true });
            setFavourites(favourites.filter(fav => fav._id !== id));
        } catch (err) {
            console.error('Error removing favourite:', err);
        }
    };

    if (!user) return <div className="text-center mt-10 text-xl">Please log in to view your favourites.</div>;

    if (loading) return <div className="text-center mt-10 text-xl">Loading your favourites...</div>;

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-centre bg-cover p-6  overflow-auto" style={{ backgroundImage: "url('/images/Sunflower2.jpg')" }}>
            <h1 className="text-3xl font-bold mt-20 mb-6">Your Favourites</h1>
            {favourites.length === 0 ? (
                <p className="text-lg">You have no favourite quotes.</p>
            ) : (
                <div className="space-y-6 max-w-xl w-full">
                    {favourites.map(fav => (
                        <div key={fav._id} className="bg-white p-6 rounded-3xl shadow-lg flex justify-between items-center">
                            <div>
                                <p className="text-xl font-semibold">"{fav.quote}"</p>
                                <p className="text-gray-500 mt-2">- {fav.author}</p>
                            </div>
                            <button
                                onClick={() => handleRemoveFavourite(fav._id)}
                                className="text-2xl text-red-500 hover:scale-110 transition-transform"
                            >
                                <FaHeart />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favourites;
