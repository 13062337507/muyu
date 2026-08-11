const SUPABASE_URL = 'https://zkhlhicoelxkrwtuyxbs.supabase.co';
const SUPABASE_KEY = '***';
const APP_ID = 'cli_aaf03841cf81cdb';
const APP_SECRET = 'H2MQ1wFZc0BqScNBS1NHngkYl6glVbdF';

exports.handler = async (event) => {
  const { code } = event.queryStringParameters || {};
  
  if (!code) {
    return { statusCode: 400, body: 'Missing code' };
  }

  try {
    // 用授权码换取 access_token
    const tokenRes = await fetch('https://open.feishu.cn/open-apis/authen/v1/oidc/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: APP_ID,
        client_secret: APP_SECRET,
        code,
        redirect_uri: 'https://subtle-tulumba-21c3c3.netlify.app/callback'
      })
    });
    
    const tokenData = await tokenRes.json();
    
    if (tokenData.code !== 0) {
      return { statusCode: 500, body: JSON.stringify(tokenData) };
    }

    const accessToken = tokenData.data.access_token;

    // 用 access_token 获取用户信息
    const userRes = await fetch('https://open.feishu.cn/open-apis/authen/v1/user_info', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    const userData = await userRes.json();
    
    if (userData.code !== 0) {
      return { statusCode: 500, body: JSON.stringify(userData) };
    }

    const user = userData.data;
    
    // 重定向到首页，带上用户信息
    const redirectUrl = `/?userId=${user.user_id}&userName=${encodeURIComponent(user.name)}`;
    
    return {
      statusCode: 302,
      headers: { Location: redirectUrl },
      body: ''
    };
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};
