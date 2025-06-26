import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pin, Pencil } from 'lucide-react';
import axios from 'axios';
import '@fontsource/caveat';

const colors = [
    '#FFD3B6', '#FFAAA5', '#D5AAFF', '#A8E6CF', '#FDFD96',
    '#84DCCF', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#C7CEEA',
    '#FFC3A0', '#B5EAD7', '#FF9AA2', '#C9C9FF', '#FFABAB',
    '#FFFFD8', '#D4A5A5', '#AEC6CF', '#FFD6A5', '#FDFFAB'
];

const GratitudeWall = () => {
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {

            const response = await axios.get('/api/gratitude');
            const fetchedNotes = response.data.map(note => ({ ...note, isEditable: false }));
            setNotes(fetchedNotes);
        } catch (err) {
            console.error('Error fetching notes:', err);
        }
    };

    const getRandomColor = () => {
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const handleAddNote = () => {
        setIsEditing(true);
    };

    const handlePinNote = async () => {
    if (currentNote.trim() === '') return;

    const newNote = { text: currentNote, color: getRandomColor() };

    try {
        const response = await axios.post('/api/gratitude', newNote);
        const savedNote = { ...response.data, isEditable: false };
        setNotes(prevNotes => [savedNote, ...prevNotes]);
        setCurrentNote('');
        setIsEditing(false);
    } catch (err) {
        console.error('Error saving note:', err);
    }
};



    const handleUnpinNote = async (id) => {
        try {
            await axios.delete(`/api/gratitude/${id}`);
            setNotes(notes.filter(note => note._id !== id));
        } catch (err) {
            console.error('Error deleting note:', err);
        }
    };

    const updateText = async (id, newText) => {
        setNotes(notes.map(note => note._id === id ? { ...note, text: newText } : note));
        try {
            await axios.put(`/api/gratitude/${id}`, { text: newText });
        } catch (err) {
            console.error('Error updating note:', err);
        }
    };

    const toggleEditNote = (id) => {
        setNotes(notes.map(note =>
            note._id === id ? { ...note, isEditable: !note.isEditable } : note
        ));
    };

    return (
        <div className="min-h-screen bg-fixed bg-cover bg-center p-10 flex flex-wrap items-start gap-6"
            style={{ backgroundImage: "url('/images/GratWall1.png')" }}>
            <div className="absolute inset-0 bg-white opacity-30"></div>

            <div className="relative w-full flex justify-center mt-20 mb-8">

            <h1 className="font-[Caveat] text-6xl text-center text-gray-800 tracking-wide"
        style={{
            transform: 'rotate(-3deg)',
            textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
            borderBottom: '4px dashed rgb(248, 80, 71)',
            display: 'inline-block',
            paddingBottom: '10px'
        }}
    >
        My Gratitude Wall
    </h1>
    
</div>


            {/* Sticky Pad */}
            <motion.div
                initial={{ opacity: 0, y: -50, rotate: Math.random() * 10 - 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative mt-20 p-4 w-60 h-60 rounded-lg shadow-lg bg-white opacity-90 flex items-center justify-center"
            >
                {!isEditing ? (
                    <button onClick={handleAddNote} className="text-black">
                        <Plus size={48} />
                    </button>
                ) : (
                    <>
                        <textarea
                            className="w-full h-full bg-transparent focus:outline-none resize-none text-gray-800 font-[Caveat] text-2xl p-2 leading-relaxed"
                            placeholder="Write your gratitude..."
                            value={currentNote}
                            onChange={(e) => setCurrentNote(e.target.value)}
                            maxLength={200}
                            style={{ overflow: 'hidden', cursor: 'text' }}
                            autoFocus
                        />
                        <button
                            onClick={handlePinNote}
                            className="absolute top-2 right-2 text-green-500"
                        >
                            <Pin size={24} />
                        </button>
                    </>
                )}
            </motion.div>

            {/*Pinned Notes*/}
            {notes.map(note => (
                <motion.div
                    key={note._id}
                    initial={{ opacity: 0, y: -50, rotate: Math.random() * 10 - 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative mt-20 p-4 w-60 h-60 rounded-lg shadow-lg"
                    style={{ backgroundColor: note.color }}
                >
                    <textarea
                        className="w-full h-full bg-transparent focus:outline-none resize-none text-gray-800 font-[Caveat] text-2xl p-2 leading-relaxed"
                        value={note.text}
                        onChange={(e) => updateText(note._id, e.target.value)}
                        disabled={!note.isEditable}
                        style={{ overflow: 'hidden', cursor: note.isEditable ? 'text' : 'default' }}
                    />
                    <button
                        onClick={() => handleUnpinNote(note._id)}
                        className="absolute top-2 right-2 text-red-600"
                    >
                        <Pin size={24} />
                    </button>

                    <button
                        onClick={() => toggleEditNote(note._id)}
                        className={`absolute top-10 right-2 ${note.isEditable ? 'text-green-600' : 'text-blue-600'}`}
                    >
                        <Pencil size={24} />
                    </button>
                </motion.div>
            ))}
        </div>
    );
};

export default GratitudeWall;

