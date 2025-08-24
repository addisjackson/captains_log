// initLogsScript.mjs
import fs from 'fs';
import path from 'path';
import { initLogs } from './logStorage.js';
import logsData from './logs.json' assert { type: "json"};

initLogs();
console.log('Logs initialized!');
