// Node.js script to generate logs.json for all main Star Trek captains
import fs from 'fs';
import path from 'path';
import generateCaptainLogs from './logs.js';

const captains = [
  { name: 'Jean-Luc Picard', ship: 'USS Enterprise' },
  { name: 'Benjamin Sisko', ship: 'USS Defiant' },
  { name: 'Kathryn Janeway', ship: 'USS Voyager' },
  { name: 'Jonathan Archer', ship: 'Enterprise NX-01' },
  { name: 'James T. Kirk', ship: 'USS Enterprise' },
  { name: 'Michael Burnham', ship: 'USS Discovery' },
  { name: 'Christopher Pike', ship: 'USS Discovery' },
  { name: 'Gabriel Lorca', ship: 'USS Discovery' },
  { name: 'Saru', ship: 'USS Discovery' },
  { name: 'Philippa Georgiou', ship: 'USS Shenzhou' }
];

const allLogs = captains.map(c => generateCaptainLogs(c.name, c.ship));

fs.writeFileSync(
  path.join(path.resolve(), 'src/model/logs.json'),
  JSON.stringify(allLogs, null, 2)
);
console.log('logs.json generated for all main captains!');
