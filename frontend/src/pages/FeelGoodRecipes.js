import React, { useState } from 'react';
import axios from 'axios';

const FeelGoodRecipes = () => {
    const [mood, setMood] = useState('');
    const [energy, setEnergy] = useState('');
    const [time, setTime] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [recipes, setRecipes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        setLoading(true);
        setRecipes('');

        try {
            const response = await axios.post('http://localhost:5000/api/recipes/generate', { mood, energy, time });
            setRecipes(response.data.recipes);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatRecipes = (text) => {
        return text.split('\n').map((line, index) => {
            if (line.trim().match(/^Recipe\s*\d+|^\d+\./i)) {
                return <p key={index} className="font-bold mt-4">{line}</p>;
            }
            return <p key={index} className="mb-2">{line}</p>;
        });
    };

    return (
        <div className="min-h-screen bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/images/Foodbg2.jpg')" }}>
            <div className="pt-32 pb-10 flex flex-col items-center">

                <div className={`flex flex-col ${submitted && !loading && recipes ? 'lg:flex-row justify-center gap-10' : ''} w-full max-w-7xl px-6`}>

                    {/* Form Section */}
                    <div className="w-full max-w-xl bg-white/80 p-8 rounded-2xl shadow-2xl flex flex-col justify-between">
                        <h2 className="text-3xl font-semibold mb-6 text-center text-black-600">Find your perfect feel-good recipes!</h2>

                        <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                            <div>
                                <label className="block text-lg mb-3 font-medium text-gray-700">Your Current Mood</label>
                                <select value={mood} onChange={(e) => setMood(e.target.value)} className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 transition duration-300">
                                    <option value="">Select Mood</option>
                                    <option value="happy">😊Happy </option>
                                    <option value="sad">😔Sad </option>
                                    <option value="anxious">😟Anxious </option>
                                    <option value="low">💤Low </option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-lg mb-3 font-medium text-gray-700">Your Current Energy Level</label>
                                <select value={energy} onChange={(e) => setEnergy(e.target.value)} className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 transition duration-300">
                                    <option value="">Select Energy Level</option>
                                    <option value="high">⚡High </option>
                                    <option value="moderate">🙂Moderate </option>
                                    <option value="low">🐢Low </option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-lg mb-3 font-medium text-gray-700">Time Available to Cook</label>
                                <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 transition duration-300">
                                    <option value="">Select Time</option>
                                    <option value="quick">⏱️Less than 15 min </option>
                                    <option value="medium">⌛15-30 min </option>
                                    <option value="relaxed">🍳More than 30 min </option>
                                </select>
                            </div>

                            <button type="submit" className="w-full py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all text-lg font-semibold">
                                Find Recipes ✨
                            </button>

                            {/* Loader inside the form */}
                            {loading && (
                                <div className="text-green-600 font-bold text-center mt-4 animate-pulse">
                                    Fetching delicious recipes for you... 
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Recipe Display Section */}
                    {submitted && !loading && recipes && (
                        <div className="w-full max-w-xl p-8 bg-green-100 rounded-2xl shadow-lg text-green-700 text-lg leading-relaxed overflow-y-auto h-[550px] font-mono">
                            <h3 className="text-3xl font-bold mb-4 text-center">Here are some recipes to make you feel better:</h3>
                            {formatRecipes(recipes)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeelGoodRecipes;
