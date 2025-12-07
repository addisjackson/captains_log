import React, { useState } from "react";
import { addLog } from "../model/logStorage";

const AddNewLogModal = ({ onClose, onSave, captains = [], lastCrisisDates = {}, captainData = {} }) => {
  const [selectedCaptain, setSelectedCaptain] = useState(captains[0] || "");
  const [logTitle, setLogTitle] = useState("");
  const [logContent, setLogContent] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [mistakesWereMadeToday, setMistakesWereMadeToday] = useState(false);

  // Auto-populate shipName based on selected captain
  const shipName = captainData[selectedCaptain]?.shipName || "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCaptain || !logTitle) return;

    const newLog = {
      id: `${Date.now()}`, // unique ID
      logTitle,
      logContent,
      location,
      date,
      mistakesWereMadeToday,
      daysSinceLastCrisis: lastCrisisDates[selectedCaptain]
        ? Math.floor((new Date(date) - new Date(lastCrisisDates[selectedCaptain])) / (1000 * 60 * 60 * 24))
        : 0,
    };

    // Save to localStorage and call the callback
    addLog(selectedCaptain, newLog);
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Add New Log</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label>
            Captain:
            <select
              value={selectedCaptain}
              onChange={(e) => setSelectedCaptain(e.target.value)}
              className="border p-2 rounded w-full"
            >
              {captains.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          <label>
            Ship Name:
            <input
              type="text"
              value={shipName}
              disabled
              className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed text-gray-700"
            />
          </label>

          <label>
            Log Title:
            <input
              type="text"
              value={logTitle}
              onChange={(e) => setLogTitle(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </label>

          <label>
            Log Content:
            <textarea
              value={logContent}
              onChange={(e) => setLogContent(e.target.value)}
              className="border p-2 rounded w-full h-24 resize-none"
              placeholder="Enter the log content..."
            />
          </label>

          <label>
            Location:
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </label>

          <label>
            Date:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={mistakesWereMadeToday}
              onChange={(e) => setMistakesWereMadeToday(e.target.checked)}
            />
            Mistakes Made Today
          </label>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewLogModal;
