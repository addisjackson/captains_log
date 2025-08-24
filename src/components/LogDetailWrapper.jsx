import React from "react";
import { useParams, Link } from "react-router-dom";

const LogDetailWrapper = ({ logs }) => {
  const { normalizedCaptain, logId } = useParams();

  if (!logs) return <p>Loading...</p>;

  const logEntry = logs
    .find((entry) =>
      entry.captainName.toLowerCase().replace(/\s/g, "_").replace(/-/g, "") === normalizedCaptain
    )
    ?.logs.find((l) => l.id.toString() === logId);

  if (!logEntry) return <p>Log not found.</p>;

  return (
    <div className="max-w-xl mx-auto p-4 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-2">{logEntry.logTitle}</h2>
      <p><strong>Date:</strong> {logEntry.date}</p>
      <p><strong>Location:</strong> {logEntry.location}</p>
      <p><strong>Mistakes Made:</strong> {logEntry.mistakesWereMadeToday ? "Yes" : "No"}</p>
      <p className="mt-4">{logEntry.logContent}</p>
      <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">Back to Logs</Link>
    </div>
  );
};

export default LogDetailWrapper;
