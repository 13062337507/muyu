const fs = require('fs');
const path = require('path');
const DATA_FILE = '/tmp/muyu_data.json';
function readData() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ total: 0, users: {}, createdAt: new Date().toISOString() }, null, 2));
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}
function writeData(data) { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); }
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).end(); return; }
  const { userId, userName } = req.body || {};
  if (!userId) { res.status(400).json({ error: '缺少 userId' }); return; }
  const data = readData();
  data.total += 1;
  if (!data.users[userId]) data.users[userId] = 0;
  data.users[userId] += 1;
  if (userName) data.users[userId + '_name'] = userName;
  writeData(data);
  res.json({ success: true, total: data.total, userCount: data.users[userId] });
};
