// src/pages/Welcome.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Welcome = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-cover bg-centre text-white p-8 "  style={{ backgroundImage: "url('/images/loginscene4.jpg')" }}>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="text-center space-y-6"
            >
                <h1 className="text-5xl font-bold">🌿Welcome to SoulSpace 🌿</h1>
                <p className="text-lg max-w-xl mx-auto text-white">
                    Your personal companion for tracking moods, journaling, and exploring your emotional journey.
                </p>

                <div className="flex justify-center space-x-4 mt-6">
                    <Link to="/login">
                        <button className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-800 transition">
                            Login
                        </button>
                    </Link>
                    <Link to="/register">
                        <button className="px-6 py-3 bg-white text-[#9d66d9] border border-[#9d66d9] rounded-xl hover:bg-gray-300 transition">
                            Register
                        </button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Welcome;
