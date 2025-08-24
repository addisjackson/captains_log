// src/pages/CaptainLogs.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { getAllCaptainLogs } from "../model/logs";

const CaptainLogs = () => {
  const { captainName } = useParams();
  const captains = getAllCaptainLogs();

  // Find the selected captain
  const captain = captains.find((c) => c.captainName === captainName);

  if (!captain) {
    return (
      <p className="text-center mt-10 text-red-600">
        Captain "{captainName}" not found.
      </p>
    );
  }

  return (
    <div className="p-6">
      {/* Captain Header */}
      <div className="flex items-center mb-6">
        <img
          src={captain.captainImage}
          alt={captain.captainName}
          className="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <h1 className="text-2xl font-bold">{captain.captainName}</h1>
          <p className="text-gray-600">Ship: {captain.shipName}</p>
        </div>
      </div>

      {/* Captain Logs */}
      <h2 className="text-xl font-semibold mb-4">
        Logs for {captain.captainName}
      </h2>
      {captain.logs.length === 0 ? (
        <p className="text-gray-500">No logs available.</p>
      ) : (
        <ul className="space-y-4">
          {captain.logs.map((log) => (
            <li key={log.id} className="border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold">{log.title}</h3>
              <p className="text-gray-700 mb-2">
                {log.date} - {log.summary}
              </p>
              <Link
                to={`/logs/${log.id}`}
                state={{ log, captain }}
                className="text-blue-600 hover:underline"
              >
                View Details →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CaptainLogs;
