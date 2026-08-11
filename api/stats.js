const fs = require('fs');
const DATA_FILE = '/tmp/muyu_data.json';

function readData() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ total: 0, users: {}, createdAt: new Date().toISOString() }, null, 2));
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

exports.handler = async () => {
  const data = readData();
  const userList = Object.entries(data.users).filter(([k]) => !k.endsWith('_name')).map(([id, count]) => ({ id, name: data.users[id + '_name'] || id, count })).sort((a, b) => b.count - a.count);
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ total: data.total, userCount: userList.length, topUsers: userList.slice(0, 20) })
  };
};
