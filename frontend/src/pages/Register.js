import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post('http://localhost:5000/api/auth/register', {
            email,
            username,
            password
        }, { withCredentials: true });

        alert(res.data.message);
        console.log(res.data);

        // 👉 Redirect after successful registration
        window.location.href = '/manual-login';
    } catch (err) {
        console.error(err);
        const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
        alert(errorMessage);
    }
};


    return (
        <div className="pt-24 flex items-center justify-center min-h-screen bg-cover bg-centre" style={{ backgroundImage: "url('/images/loginscene4.jpg')" }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="bg-gray-100 p-8 rounded-2xl bg-opacity-80 shadow-2xl w-full max-w-md space-y-6 text-center"
            >
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Register</h1>

                <form onSubmit={handleRegister} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />

                    <button
                        type="submit"
                        className="w-full px-4 py-2 rounded-lg text-white transition focus:outline-none focus:ring-2 focus:ring-purple-300 hover:brightness-110 bg-purple-700"
                        
                    >
                        Register
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
