const fs = require('fs');
const DATA_FILE = '/tmp/muyu_data.json';

function readData() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ total: 0, users: {}, createdAt: new Date().toISOString() }, null, 2));
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

exports.handler = async (event) => {
  const userId = event.queryStringParameters?.userId;
  const data = readData();
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ userId, name: data.users[userId + '_name'] || userId, count: data.users[userId] || 0, total: data.total })
  };
};
