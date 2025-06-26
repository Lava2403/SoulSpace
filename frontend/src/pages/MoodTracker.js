import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { FaCalendarAlt } from 'react-icons/fa';

const MoodTracker = () => {
  const [mood, setMood] = useState(5);
  const [tag, setTag] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [moodLogs, setMoodLogs] = useState([]);

  const getWeeklySummary = (logs) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const lastWeekLogs = logs.filter(log => new Date(log.date) >= sevenDaysAgo);
    if (lastWeekLogs.length === 0) return "You haven't logged any moods this week.";

    const averageMood = lastWeekLogs.reduce((acc, log) => acc + log.mood, 0) / lastWeekLogs.length;

    if (averageMood >= 7) return "You've generally felt good this week. Keep it up!";
    if (averageMood >= 4) return "You've had mixed feelings this week. Stay mindful!";
    return "It's been a tough week. Take care and reach out if needed.";
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString());
    }
    return days;
  };

  const getProcessedMoodData = () => {
    const last7Days = getLast7Days();

    const latestMoodsPerDay = {};
    moodLogs.forEach(log => {
      const logDate = new Date(log.date).toLocaleDateString();
      if (!latestMoodsPerDay[logDate] || new Date(log.date) > new Date(latestMoodsPerDay[logDate].date)) {
        latestMoodsPerDay[logDate] = log;
      }
    });

    return last7Days.map(date => {
      const moodLog = latestMoodsPerDay[date];
      return {
        date,
        mood: moodLog ? moodLog.mood : null,
        tag: moodLog ? moodLog.tag : '',
      };
    });
  };

  return (
    <div className="flex justify-center min-h-screen p-6 pt-20 bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: `url('/images/Mountains.jpg')` }}
    >

      {/* Subtle Blur Layer
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-sm scale-105 z-0"
        style={{ backgroundImage: `url('/images/MotivationLeaf.jpg')` }}
      ></div> */}

      {/* Dim Layer */}
      <div className="absolute inset-0 bg-black bg-opacity-10 z-0"></div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-8 max-w-[1200px] w-full relative z-10">

        {/* Mood Logger Card */}
        <div className="bg-white bg-opacity-50 p-8 backdrop-blur-sm rounded-2xl shadow-lg flex-1 min-w-[300px]">
          <h1 className="text-4xl font-bold text-black mb-4 text-center">
            Weekly Mood Tracker
          </h1>
          <p className="text-center text-lg text-gray-700 mb-6">
            Log your mood daily and visualize your emotional journey!
          </p>

          {/* Mood Box Selector */}
          <div className="flex flex-col items-center mb-6 mt-6">
            <label className="mb-4 text-lg font-medium">Select Your Mood: {mood}</label>
            <div className="flex flex-wrap justify-center gap-2">
              {[...Array(10)].map((_, index) => {
                const moodValue = index + 1;
                const hue = 0 + ((120 - 0) / 9) * index;
                const bgColor = `hsl(${hue}, 70%, 50%)`;
                const selectedStyle = moodValue === mood ? 'ring-4 ring-purple-500 scale-110' : '';

                return (
                  <div
                    key={moodValue}
                    className={`w-8 h-8 flex items-center justify-center text-white text-sm font-bold rounded cursor-pointer hover:scale-110 transition-transform ${selectedStyle}`}
                    style={{ backgroundColor: bgColor }}
                    onClick={() => setMood(moodValue)}
                  >
                    {moodValue}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Date Picker */}
          <div className="flex flex-col items-center mb-4">
            <label className="mb-2 text-lg font-medium flex items-center gap-2">
              <FaCalendarAlt /> Select Date:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 border rounded"
            />
          </div>

          {/* Tag Input */}
          <div className="flex flex-col items-center mb-4">
            <label className="mb-2 text-lg font-medium">Add Mood Tags (Optional)</label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="p-2 border rounded w-full"
              placeholder="e.g. happy, excited, sad, angry"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                if (!selectedDate) {
                  alert("Please select a date.");
                  return;
                }
                const newLog = {
                  mood,
                  tag,
                  date: new Date(selectedDate).toISOString(),
                };
                const existingLogIndex = moodLogs.findIndex(
                  (log) => new Date(log.date).toLocaleDateString() === new Date(selectedDate).toLocaleDateString()
                );

                let updatedLogs;

                if (existingLogIndex !== -1) {
                  updatedLogs = [...moodLogs];
                  updatedLogs[existingLogIndex] = newLog;
                } else {
                  updatedLogs = [...moodLogs, newLog];
                }

                setMoodLogs(updatedLogs);
                setTag('');
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Log Mood
            </button>
          </div>
        </div>

        {/* Mood Graph Card */}
        {moodLogs.length > 0 && (
          <div className="bg-white bg-opacity-50 backdrop-blur-sm p-8 rounded-2xl shadow-lg flex-1 min-w-[300px]">
            <h2 className="text-2xl font-bold text-center mb-4">Mood Graph</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getProcessedMoodData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[1, 10]} />
                <Tooltip formatter={(value, name, props) => [`Mood: ${value}`, `Tag: ${props.payload.tag}`]} />
                <Line
                  type="linear"
                  dataKey="mood"
                  stroke="#000000"
                  activeDot={{ r: 8 }}
                  dot={{ stroke: '#000000', strokeWidth: 2, fill: '#000000' }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-6 text-center text-lg font-medium text-gray-800">
              {getWeeklySummary(moodLogs)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;
