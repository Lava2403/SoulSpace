import React, { useState, useRef, useEffect } from 'react';
import { FaCalendarAlt, FaSave, FaListUl, FaTrashAlt, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Journaling = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [journalText, setJournalText] = useState('');
  const [savedEntries, setSavedEntries] = useState([]);
  const [showSavedList, setShowSavedList] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const dateInputRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    axios.get('/api/journal', {
      params: { userId: user._id }
    })
      .then(res => setSavedEntries(res.data))
      .catch(err => console.error('Error fetching entries:', err));
  }, [user]);

  const handleIconClick = () => {
    dateInputRef.current.showPicker();
  };

  const handleSave = async () => {
    if (!user || !user._id) {
      alert('User not authenticated. Please log in again.');
      return;
    }

    if (journalText.trim() === '' || selectedDate === '') {
      alert('Please select a date and write something to save.');
      return;
    }

    try {
      const existingEntry = savedEntries.find(e => e.date === selectedDate);

      if (existingEntry && !editingEntryId) {
        alert('Entry for this date already exists. Click edit to modify it.');
        return;
      }

      if (editingEntryId) {
        const res = await axios.put(`/api/journal/${editingEntryId}`, {
          userId: user._id,
          date: selectedDate,
          content: journalText
        });

        setSavedEntries(prev =>
          prev.map(entry => (entry._id === editingEntryId ? res.data : entry))
        );

        alert('Journal entry updated!');
      } else {
        const res = await axios.post('/api/journal', {
          userId: user._id,
          date: selectedDate,
          content: journalText
        });

        setSavedEntries(prev => [...prev, res.data]);
        alert('Journal entry saved!');
      }

      setSelectedDate('');
      setJournalText('');
      setEditingEntryId(null);
    } catch (err) {
      console.error('Error saving entry:', err);
      alert('Failed to save entry');
    }
  };

  const handleLoadEntry = (entry) => {
    setSelectedDate(entry.date);
    setJournalText(entry.content);
    setEditingEntryId(entry._id);
    setShowSavedList(false);
  };

  const handleDelete = async (entryId) => {
    try {
      await axios.delete(`/api/journal/${entryId}`);
      setSavedEntries(prev => prev.filter(entry => entry._id !== entryId));
    } catch (err) {
      console.error('Failed to delete entry:', err);
      alert('Could not delete entry.');
    }
  };

  return (
    <div
      className="flex justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/images/Lavender.jpg')" }}
    >
      <div className="mt-20 bg-white bg-opacity-60 p-8 rounded-lg shadow-lg relative">
        <div className="flex justify-start items-center space-x-4 mb-4">
          <div
            className="flex items-center cursor-pointer text-purple-700 hover:text-purple-900"
            onClick={handleIconClick}
            title="Select Date"
          >
            <FaCalendarAlt size={24} />
          </div>
          <div
            className="flex items-center cursor-pointer text-purple-700 hover:text-purple-900"
            onClick={() => setShowSavedList(!showSavedList)}
            title="Saved Entries"
          >
            <FaListUl size={24} />
          </div>
        </div>

        {showSavedList && (
          <div className="mb-4 p-5 bg-white rounded-lg shadow-inner max-h-60 overflow-y-auto">
            {savedEntries.length === 0 ? (
              <p className="text-gray-600">No entries saved yet.</p>
            ) : (
              savedEntries.map((entry) => (
                <div
                  key={entry._id}
                  className="flex justify-between items-center p-2 hover:bg-purple-200 rounded-lg"
                >
                  <span
                    onClick={() => handleLoadEntry(entry)}
                    className="cursor-pointer"
                  >
                    {entry.date}
                  </span>
                  <div className="flex items-center gap-3">
                    <FaEdit
                      className="text-blue-500 cursor-pointer"
                      title="Edit"
                      onClick={() => handleLoadEntry(entry)}
                    />
                    <FaTrashAlt
                      className="text-red-600 cursor-pointer"
                      title="Delete"
                      onClick={() => handleDelete(entry._id)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <h1 className="text-4xl font-bold text-black text-center mb-4">
          Welcome to Your Journal
        </h1>

        <input
          type="date"
          ref={dateInputRef}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="hidden"
        />

        <div className="relative">
          {selectedDate && (
            <div
              className="absolute top-4 right-4 text-gray-700 text-lg"
              style={{ fontFamily: "'Caveat', cursive", fontSize: '22px' }}
            >
              Date : {selectedDate}
            </div>
          )}

          <textarea
            className="w-[600px] h-[400px] p-4 pt-11 text-lg rounded-lg shadow-inner border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            placeholder="Write your thoughts here..."
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '24px',
              backgroundImage: 'repeating-linear-gradient(to bottom, white, white 25px, #d1d5db 29px)',
              backgroundSize: '100% 30px',
              backgroundPosition: '0 10px',
              lineHeight: '30px',
            }}
          />
        </div>

        <button
          onClick={handleSave}
          className="mt-4 flex items-center px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-700"
        >
          <FaSave className="mr-2" />
          {editingEntryId ? 'Update Entry' : 'Save Entry'}
        </button>
      </div>
    </div>
  );
};

export default Journaling;
