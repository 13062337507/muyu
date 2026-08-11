const fs = require('fs');
const path = require('path');
const DATA_FILE = '/tmp/muyu_data.json';
function readData() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ total: 0, users: {}, createdAt: new Date().toISOString() }, null, 2));
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const userId = req.query.userId;
  const data = readData();
  res.json({ userId, name: data.users[userId + '_name'] || userId, count: data.users[userId] || 0, total: data.total });
};
