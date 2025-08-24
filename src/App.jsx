import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { initLogs, getLogs, updateLog } from "./model/logStorage";

import NavBar from "./components/NavBar";
import LogList from "./components/LogList";
import LogDetail from "./components/LogDetail";
import { captainNames } from "./assets/index.js";

initLogs();

function App() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ searchQuery: "", captain: "all" });
  const [editingLog, setEditingLog] = useState(null);

  useEffect(() => {
    setLogs(getLogs());
  }, []);

  const refreshLogs = () => setLogs(getLogs());

  const handleEditLog = (captainEntry, log) => {
    setEditingLog({ ...log, captainEntry });
  };

  const handleCloseModal = () => {
    setEditingLog(null);
    refreshLogs();
  };

  const handleFilterChange = (updated) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const normalizedCaptainNames = captainNames.map(name =>
    name.toLowerCase().replace(/\s/g, "_").replace(/-/g, "")
  );

  return (
    <>
      <NavBar filters={filters} setFilters={setFilters} />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          {/* Home: All Logs */}
          <Route
            path="/"
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
