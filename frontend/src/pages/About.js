// src/pages/About.js

import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <div className="pt-24 flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/abtbg5.jpg')" }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white/60 p-10 rounded-2xl shadow-2xl max-w-3xl text-center space-y-6"
            >
                <h1 className="text-4xl font-bold text-purple-700">About SoulSpace</h1>
                <p className="text-gray-700 text-lg leading-relaxed">
                    SoulSpace is your personal mental wellness companion. Our platform helps you track your mood, express yourself through journaling, and explore uplifting resources like feel-good recipes, inspiring quotes, and music recommendations tailored to your emotions.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                    Our mission is to create a safe and supportive space where you can nurture your mental health and well-being every single day.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                    Dive into your journey of self-care with SoulSpace 💜💕
                </p>
            </motion.div>
        </div>
    );
};

export default About;
