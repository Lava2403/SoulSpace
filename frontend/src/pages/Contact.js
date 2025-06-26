// src/pages/Contact.js
import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/images/abtbg5.jpg')" }}>
      <div className="bg-white/80 p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">Contact Us</h1>
        <p className="text-gray-700 text-lg">
          You can reach us at:{' '}
          <a
            href="mailto:soulspace.verify@gmail.com"
            className="text-blue-600 hover:underline"
          >
            soulspace.verify@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default Contact;
