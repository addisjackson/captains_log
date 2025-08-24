// src/components/LogList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getLogs, removeLog, addLog, updateLog } from "../model/logStorage";
import { captainImages, shipImages, supportImages } from "../assets/index.js";
import AddNewLogModal from "./AddNewLogModal";
import EditLogModal from "./EditLogModal";

const LogList = ({ filters = {}, onFilterChange = () => {}, onEditLog }) => {
  const [logs, setLogs] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [editingCaptain, setEditingCaptain] = useState(null);
  const [mistakesFilter, setMistakesFilter] = useState({ yes: false, no: false });
  const [sortOption, setSortOption] = useState("none");
  const [sortDirection, setSortDirection] = useState("asc");
  const [bgIndex, setBgIndex] = useState(0);

  // Rotate supportImages every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % supportImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Highlight search matches
  function highlightMatch(text, query) {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i} className="bg-yellow-300 rounded px-1">{part}</mark> : part
    );
  }

  // Load logs
  useEffect(() => {
    setLogs(getLogs() || []);
  }, []);

  const refreshLogs = () => setLogs(getLogs() || []);
  const captainsList = logs.map((entry) => entry.captainName).filter(Boolean);

  // Add daysSinceLastCrisis
  const logsWithDays = logs.map((entry) => ({
    ...entry,
    logs: entry.logs.map((log) => ({
      ...log,
      daysSinceLastCrisis: entry.lastCrisisDate
        ? Math.floor((new Date(log.date) - new Date(entry.lastCrisisDate)) / (1000 * 60 * 60 * 24))
        : 0,
    })),
  }));

  // Filtering
  const filteredLogs = logsWithDays
    .map((entry) => {
      const search = (filters.searchQuery || "").toLowerCase();
      const filteredEntryLogs = entry.logs.filter((log) => {
        return (
          entry.captainName?.toLowerCase().includes(search) ||
          entry.shipName?.toLowerCase().includes(search) ||
          log.logTitle?.toLowerCase().includes(search) ||
          log.logContent?.toLowerCase().includes(search) ||
          log.location?.toLowerCase().includes(search)
        );
      });
      return { ...entry, logs: filteredEntryLogs };
    })
    .filter(
      (entry) =>
        entry.logs.length > 0 &&
        (!filters.captain || filters.captain === "all" || entry.captainName === filters.captain)
    )
    .filter((entry) => {
      if (!(mistakesFilter.yes || mistakesFilter.no)) return true;
      entry.logs = entry.logs.filter((l) => {
        if (mistakesFilter.yes && l.mistakesWereMadeToday) return true;
        if (mistakesFilter.no && !l.mistakesWereMadeToday) return true;
        return false;
      });
      return entry.logs.length > 0;
    });

  // Sorting
  const sortedLogs = [...filteredLogs];
  if (sortOption !== "none") {
    sortedLogs.sort((a, b) => {
      let valA, valB;
      if (sortOption === "alphabetical") {
        valA = a.captainName || "";
        valB = b.captainName || "";
      } else if (sortOption === "daysSinceLastCrisis") {
        valA = Math.min(...a.logs.map((l) => l.daysSinceLastCrisis));
        valB = Math.min(...b.logs.map((l) => l.daysSinceLastCrisis));
      } else if (sortOption === "logDate") {
        valA = new Date(Math.min(...a.logs.map((l) => new Date(l.date))));
        valB = new Date(Math.min(...b.logs.map((l) => new Date(l.date))));
      }
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  const handleDelete = (captainName, logId) => {
    removeLog(captainName, logId);
    refreshLogs();
  };

  const handleAddLog = (captainName, newLog) => {
    setLogs((prevLogs) => {
      const updatedLogs = prevLogs.map((entry) => {
        if (entry.captainName === captainName) {
          return { ...entry, logs: [...entry.logs, newLog] };
        }
        return entry;
      });
      const captainExists = updatedLogs.some((entry) => entry.captainName === captainName);
      if (!captainExists) {
        updatedLogs.push({ captainName, shipName: "", lastCrisisDate: null, logs: [newLog] });
      }
      localStorage.setItem("captainsLogs", JSON.stringify(updatedLogs));
      return updatedLogs;
    });
    setShowAddModal(false);
  };

  const searchQuery = filters.searchQuery || "";

  return (
    <div className="relative">
      {/* Rotating background */}
      <div
        className="fixed inset-0 bg-cover bg-center opacity-50 -z-10"
        style={{ backgroundImage: `url(${supportImages[bgIndex]})` }}
      />

      <h2 className="text-2xl font-bold mb-4 text-center mt-4">Captain’s Logs</h2>

      {/* Sticky Filter/Sort/Add section */}
      <div className="sticky top-0 z-20 flex flex-wrap gap-4 items-center justify-between bg-blue-500 p-4 shadow-md">
        <input
          type="text"
          placeholder="Search logs..."
          value={searchQuery}
          onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          className="border p-2 rounded flex-1 text-center"
        />
        <select
          value={filters.captain || "all"}
          onChange={(e) => onFilterChange({ captain: e.target.value })}
          className="border p-2 rounded flex-1 text-center"
        >
          <option value="all">All Captains</option>
          {captainsList.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <div className="flex items-center gap-2 flex-1 justify-center">
          <label>
            <input
              type="checkbox"
              checked={mistakesFilter.yes}
              onChange={(e) => setMistakesFilter({ ...mistakesFilter, yes: e.target.checked })}
            /> Mistakes Yes
          </label>
          <label>
            <input
              type="checkbox"
              checked={mistakesFilter.no}
              onChange={(e) => setMistakesFilter({ ...mistakesFilter, no: e.target.checked })}
            /> Mistakes No
          </label>
        </div>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border p-2 rounded flex-1 text-center"
        >
          <option value="none">No Sorting</option>
          <option value="alphabetical">Captain Name (A-Z)</option>
          <option value="daysSinceLastCrisis">Days Since Last Crisis</option>
          <option value="logDate">Log Date</option>
        </select>
        {sortOption !== "none" && (
          <div className="flex items-center gap-2 flex-1 justify-center">
            <label>
              <input
                type="radio"
                checked={sortDirection === "asc"}
                onChange={() => setSortDirection("asc")}
              /> Asc
            </label>
            <label>
              <input
                type="radio"
                checked={sortDirection === "desc"}
                onChange={() => setSortDirection("desc")}
              /> Desc
            </label>
          </div>
        )}
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 flex-1"
          onClick={() => setShowAddModal(true)}
        >
          New Log
        </button>
      </div>

      {/* Logs Table */}
      <div className="mt-4">
        {sortedLogs.length > 0 ? (
          sortedLogs.map((entry) => (
            <div key={entry.captainName} className="border rounded-lg p-4 mb-6 shadow-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img src={captainImages[entry.captainName]} alt={entry.captainName} className="w-60 h-60 rounded-full object-cover"/>
                  <span className="font-semibold">{highlightMatch(entry.captainName, searchQuery)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{highlightMatch(entry.shipName, searchQuery)}</span>
                  <img src={shipImages[entry.shipName]} alt={entry.shipName} className="w-48 h-48 object-contain"/>
                </div>
              </div>
              <table className="w-full border-collapse border mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1">Title</th>
                    <th className="border px-2 py-1">Location</th>
                    <th className="border px-2 py-1">Date</th>
                    <th className="border px-2 py-1">Days Since Last Crisis</th>
                    <th className="border px-2 py-1">Mistakes Made</th>
                    <th className="border px-2 py-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entry.logs.map((log) => (
                    <tr key={log.id}>
                      <td className="border px-2 py-1 text-center">
                        <Link to={`/${encodeURIComponent(entry.captainName)}/${log.id}`} className="text-blue-600 hover:underline">
                          {highlightMatch(log.logTitle, searchQuery)}
                        </Link>
                      </td>
                      <td className="border px-2 py-1 text-center">{highlightMatch(log.location, searchQuery)}</td>
                      <td className="border px-2 py-1 text-center">{log.date}</td>
                      <td className="border px-2 py-1 text-center">{log.daysSinceLastCrisis}</td>
                      <td className="border px-2 py-1 text-center">{log.mistakesWereMadeToday ? "Yes" : "No"}</td>
                      <td className="border px-2 py-1 flex justify-center gap-4">
                        <button className="px-2 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500" onClick={() => {setEditingLog(log); setEditingCaptain(entry);}}>Edit</button>
                        <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => handleDelete(entry.captainName, log.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p>No logs found.</p>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AddNewLogModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddLog}
          captains={captainsList}
          lastCrisisDates={logsWithDays.reduce((acc, e) => { acc[e.captainName] = e.lastCrisisDate; return acc; }, {})}
        />
      )}

      {/* Edit Modal */}
      {editingLog && editingCaptain && (
        <EditLogModal
          log={editingLog}
          captain={editingCaptain}
          onClose={() => { setEditingLog(null); setEditingCaptain(null); refreshLogs(); }}
        />
      )}
    </div>
  );
};

export default LogList;
