const fs = require('fs');
const path = require('path');

// 로그 저장 경로 (꼭 절대경로로! WSL 우분투 내 폴더)
const logPath = '/var/log/auth.log';

// 로그인 API
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await user.comparePassword(password))) {
    // 로그인 실패했으면 로그 남기기
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const logMessage = `[${new Date().toISOString()}] Failed login from ${ip}\n`;
    
    fs.appendFileSync(logPath, logMessage); // 추가쓰기(append)

    return res.status(401).json({ message: 'Login failed' });
  }

  // 로그인 성공 로직
  req.session.userId = user._id;
  res.json({ message: 'Login success' });
});
