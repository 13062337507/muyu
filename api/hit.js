const fs = require('fs');
const path = require('path');
const DATA_FILE = '/tmp/muyu_data.json';

function readData() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ total: 0, users: {}, createdAt: new Date().toISOString() }, null, 2));
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeData(data) { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); }

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
  
  const { userId, userName } = JSON.parse(event.body || '{}');
  if (!userId) return { statusCode: 400, body: JSON.stringify({ error: '缺少 userId' }) };
  
  const data = readData();
  data.total++;
  if (!data.users[userId]) data.users[userId] = { count: 0 };
  data.users[userId].count++;
  if (userName) data.users[userId]._name = userName;
  writeData(data);
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ success: true, total: data.total, userCount: data.users[userId].count })
  };
};
