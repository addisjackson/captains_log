import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { initLogs, getLogs } from "./model/logStorage";
import LogList from "./components/LogList";
import LogDetail from "./components/LogDetail";

initLogs();

function App() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ searchQuery: "", captain: "all" });
  const [editingLog, setEditingLog] = useState(null);

  useEffect(() => {
    setLogs(getLogs());
  }, []);

  const handleEditLog = (captainEntry, log) => {
    setEditingLog({ ...log, captainEntry });
  };

  const handleFilterChange = (updated) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <Routes>
          {/* Redirect root to /captains_logs */}
          <Route path="/" element={<Navigate to="/captains_logs" replace />} />

          {/* Home: All Logs */}
          <Route
            path="/captains_logs"
            element={
              <LogList
                logs={logs}
                filters={filters}
                onFilterChange={handleFilterChange}
                onEditLog={handleEditLog}
              />
            }
          />

          {/* Single log detail */}
          <Route path="/:captainName/:logId" element={<LogDetail />} />
        </Routes>
      </div>

      {editingLog && (
        <LogList
          logs={logs}
          filters={filters}
          onFilterChange={handleFilterChange}
          onEditLog={handleEditLog}
        />
      )}
    </>
  );
}

export default App;
