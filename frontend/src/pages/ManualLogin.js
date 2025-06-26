import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle } from 'lucide-react';

const ManualLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loginUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [success, setSuccess] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState('');

    // ✅ Read verification status from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const verified = params.get('verified');

        if (verified === 'true') {
            setVerificationMessage('✅ Email verified successfully! You can now log in.');
        } else if (verified === 'already') {
            setVerificationMessage('ℹ️ Email already verified. Please log in.');
        } else if (verified === 'false') {
            setVerificationMessage('❌ Verification failed or link expired. Please try registering again.');
        }
    }, [location.search]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            }, { withCredentials: true });

            console.log(res.data);
            loginUser(res.data.user);
            setSuccess(true);

            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="pt-24 bg-cover bg-centre flex items-center justify-center min-h-screen" style={{ backgroundImage: "url('/images/loginscene4.jpg')" }}>
            {success ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center bg-gray-100 p-8 rounded-2xl shadow-2xl"
                >
                    <CheckCircle size={80} color="#4BB543" className="mb-4" />
                    <h2 className="text-2xl font-bold text-green-600">Logged in successfully!</h2>
                    <p className="text-gray-600 mt-2">Redirecting to Dashboard...</p>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="bg-gray-100/80 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6 text-center"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Login</h1>

                    {/* ✅ Show verification message if present */}
                    {verificationMessage && (
                        <p className="text-gray-400 font-medium mb-4">{verificationMessage}</p>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />

                        <button
                            type="submit"
                            className="w-full px-4 py-2 rounded-lg text-white transition focus:outline-none focus:ring-2 focus:ring-purple-300 hover:brightness-110
                            bg-purple-700"
                        >
                            Login
                        </button>
                    </form>
                </motion.div>
            )}
        </div>
    );
};

export default ManualLogin;
