// src/components/LogDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getLogs, removeLog, updateLog, saveLogs } from "../model/logStorage";
import { captainImages, shipImages, supportImages } from "../assets/index.js";
import EditLogModal from "./EditLogModal";

const LogDetail = () => {
  const { captainName, logId } = useParams();
  const navigate = useNavigate();

  const [captainEntry, setCaptainEntry] = useState(null);
  const [log, setLog] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [bgImage, setBgImage] = useState("");

  // Pick random background image on load
  useEffect(() => {
    if (supportImages && supportImages.length > 0) {
      const randomIndex = Math.floor(Math.random() * supportImages.length);
      setBgImage(supportImages[randomIndex]);
    }
  }, []);

  // Load logs
  useEffect(() => {
    const logs = getLogs() || [];
    const entry = logs.find(
      (e) => e.captainName === decodeURIComponent(captainName)
    );
    if (entry) {
      setCaptainEntry(entry);
      const foundLog = entry.logs.find((l) => l.id === logId);
      setLog(foundLog || null);
    }
  }, [captainName, logId]);

  if (!captainEntry) return <p className="text-center mt-10">Captain not found.</p>;
  if (!log) return <p className="text-center mt-10">Log not found.</p>;

  const handleDelete = () => {
    removeLog(captainEntry.captainName, log.id);
    navigate("/"); // redirect back to logs list
  };

  const handleSave = (updatedLog) => {
    updateLog(captainEntry.captainName, updatedLog);
    setLog(updatedLog); // ✅ update state so UI refreshes instantly
  };

  return (
    <div
      className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8 relative"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: 0.95,
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">{log.logTitle}</h2>
        <Link to="/" className="text-blue-600 hover:underline">
          ← Back to Logs
        </Link>
      </div>

      <div className="flex justify-center items-center gap-8 mb-6">
        <div className="flex flex-col items-center">
          <img
            src={captainImages[captainEntry.captainName]}
            alt={captainEntry.captainName}
            className="w-64 h-64 rounded-full object-cover shadow-md"
          />
          <span className="mt-2 font-semibold">{captainEntry.captainName}</span>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={shipImages[captainEntry.shipName]}
            alt={captainEntry.shipName}
            className="w-64 h-64 object-contain shadow-md"
          />
          <span className="mt-2 font-semibold">{captainEntry.shipName}</span>
        </div>
      </div>

      <div className="space-y-4 text-center">
        <p><strong>Date:</strong> {log.date}</p>
        <p><strong>Location:</strong> {log.location}</p>
        <p><strong>Days Since Last Crisis:</strong> {log.daysSinceLastCrisis}</p>
        <p><strong>Mistakes Made:</strong> {log.mistakesWereMadeToday ? "Yes" : "No"}</p>
        <div>
          <strong>Content:</strong>
          <p className="mt-2 p-4 bg-gray-100 rounded">{log.logContent}</p>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setShowEditModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-6 py-2 rounded shadow hover:bg-red-700"
        >
          Delete
        </button>
      </div>

      {showEditModal && (
        <EditLogModal
          log={log}
          captain={captainEntry}
          onClose={() => setShowEditModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default LogDetail;
