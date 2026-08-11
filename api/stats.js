const fs = require('fs');
const path = require('path');
const DATA_FILE = path.join(process.env.LAMBDA_TASK_ROOT || '/tmp', 'muyu_data.json');
function readData() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ total: 0, users: {}, createdAt: new Date().toISOString() }, null, 2));
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const data = readData();
  const userList = Object.entries(data.users).filter(([k]) => !k.endsWith('_name')).map(([id, count]) => ({ id, name: data.users[id + '_name'] || id, count })).sort((a, b) => b.count - a.count);
  res.json({ total: data.total, userCount: userList.length, topUsers: userList.slice(0, 20) });
};