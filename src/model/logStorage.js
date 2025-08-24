// src/model/logStorage.js
import logsData from "./logs.json"; // ✅ plain array
import { captainImages, shipImages } from "../assets/index.js";

const STORAGE_KEY = "captainsLogs";

// Fallback placeholders
const defaultCaptainImage = "/images/captain.png";
const defaultShipImage = "/images/ship.png";

/**
 * Ensure each captain object has valid images
 * @param {Array} logsArray
 * @returns {Array}
 */
function sanitizeLogs(logsArray) {
  return logsArray.map((captain) => ({
    ...captain,
    captainImage: captainImages[captain.captainName] || defaultCaptainImage,
    shipImage: shipImages[captain.shipName] || defaultShipImage,
  }));
}

/**
 * Initialize logs into localStorage only once
 */
export function initLogs() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const sanitized = sanitizeLogs(logsData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    console.log("Logs initialized in localStorage");
  }
}

/**
 * Retrieve sanitized logs from localStorage
 * @returns {Array}
 */
export function getLogs() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  return sanitizeLogs(JSON.parse(stored));
}

/**
 * Save logs array back to localStorage
 * @param {Array} logsArray
 */
function saveLogs(logsArray) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logsArray));
}

/**
 * Add a new log for a captain
 * @param {string} captainName
 * @param {Object} newLog
 */
export function addLog(captainName, newLog) {
  const allLogs = getLogs().map((captain) =>
    captain.captainName === captainName
      ? { ...captain, logs: [...captain.logs, newLog] }
      : captain
  );
  saveLogs(allLogs);
}

/**
 * Remove a log by captain and log ID
 * @param {string} captainName
 * @param {string|number} logId
 */
export function removeLog(captainName, logId) {
  const allLogs = getLogs().map((captain) =>
    captain.captainName === captainName
      ? { ...captain, logs: captain.logs.filter((log) => log.id !== logId) }
      : captain
  );
  saveLogs(allLogs);
}

/**
 * Update a log by captain and updated log object
 * @param {string} captainName
 * @param {Object} updatedLog
 */
export function updateLog(captainName, updatedLog) {
  const allLogs = getLogs().map((captain) =>
    captain.captainName === captainName
      ? {
          ...captain,
          logs: captain.logs.map((log) =>
            log.id === updatedLog.id ? { ...log, ...updatedLog } : log
          ),
        }
      : captain
  );
  saveLogs(allLogs);
}

/**
 * Show a single log by captain and log ID
 * @param {string} captainName
 * @param {string|number} logId
 * @returns {Object|null}
 */
export function showLog(captainName, logId) {
  const captain = getLogs().find((c) => c.captainName === captainName);
  if (!captain) return null;
  const log = captain.logs.find((l) => l.id === logId);
  return log || null;
}

/**
 * Refresh logs from localStorage
 * @returns {Array}
 */
export function refreshLogs() {
  return getLogs();
}
