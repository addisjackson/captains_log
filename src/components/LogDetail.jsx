// src/components/LogDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { getLogs } from "../model/logStorage";
import { captainImages, shipImages } from "../assets/index.js";

const LogDetail = () => {
  const { captainName, logId } = useParams();
  const logs = getLogs() || [];

  // Find the captain entry
  const captainEntry = logs.find((entry) => entry.captainName === decodeURIComponent(captainName));
  if (!captainEntry) return <p className="text-center mt-10">Captain not found.</p>;

  // Find the log
  const log = captainEntry.logs.find((l) => l.id === logId);
  if (!log) return <p className="text-center mt-10">Log not found.</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">{log.logTitle}</h2>
        <Link to="/" className="text-blue-600 hover:underline">← Back to Logs</Link>
      </div>

      <div className="flex items-center gap-8 mb-6">
        <div className="flex flex-col items-center">
          <img
            src={captainImages[captainEntry.captainName]}
            alt={captainEntry.captainName}
            className="w-60 h-60 rounded-full object-cover shadow-md"
          />
          <span className="mt-2 font-semibold">{captainEntry.captainName}</span>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={shipImages[captainEntry.shipName]}
            alt={captainEntry.shipName}
            className="w-72 h-72 object-contain shadow-md"
          />
          <span className="mt-2 font-semibold">{captainEntry.shipName}</span>
        </div>
      </div>

      <div className="space-y-4">
        <p><strong>Date:</strong> {log.date}</p>
        <p><strong>Location:</strong> {log.location}</p>
        <p><strong>Days Since Last Crisis:</strong> {log.daysSinceLastCrisis}</p>
        <p><strong>Mistakes Made:</strong> {log.mistakesWereMadeToday ? "Yes" : "No"}</p>
        <div>
          <strong>Content:</strong>
          <p className="mt-2 p-4 bg-gray-100 rounded">{log.logContent}</p>
        </div>
      </div>
    </div>
  );
};

export default LogDetail;
