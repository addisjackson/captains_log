import React, { useState } from "react";
import { getLogs, saveLogs } from "../model/logStorage"; // ✅ add saveLogs to persist edits

const normalizeCaptainName = (name = "") =>
  name.toLowerCase().replace(/\s+/g, "_").replace(/-/g, "");

const EditLogModal = ({ log, captain, onClose, onSave }) => {
  const [logTitle, setLogTitle] = useState(log.logTitle || "");
  const [logContent, setLogContent] = useState(log.logContent || "");
  const [location, setLocation] = useState(log.location || "");
  const [date, setDate] = useState(
    log.date || new Date().toISOString().slice(0, 10)
  );
  const [mistakesWereMadeToday, setMistakesWereMadeToday] = useState(
    log.mistakesWereMadeToday || false
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Build updated log
    const updatedLog = {
      ...log,
      logTitle,
      logContent,
      location,
      date,
      mistakesWereMadeToday,
    };

    // ✅ Persist change to storage
    const logs = getLogs() || [];
    const updatedLogs = logs.map((entry) => {
      if (entry.captainName === captain.captainName) {
        return {
          ...entry,
          logs: entry.logs.map((l) =>
            l.id === log.id ? updatedLog : l
          ),
        };
      }
      return entry;
    });

    saveLogs(updatedLogs);

    // ✅ Update parent view immediately
    if (onSave) {
      onSave(updatedLog);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Edit Log</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <p><strong>Captain:</strong> {captain.captainName}</p>
          <p><strong>Ship:</strong> {captain.shipName}</p>

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

          <label>
            Content:
            <textarea
              value={logContent}
              onChange={(e) => setLogContent(e.target.value)}
              className="border p-2 rounded w-full h-32"
            />
          </label>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLogModal;
