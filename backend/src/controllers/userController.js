const { addUser, getAllUsers, getUser } = require('../storage/users');
const { registerUser } = require('../services/kms');

exports.register = async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Missing username' });
  }

  try {
    // 使用 KMS 註冊用戶
    const { privateKey, certificate } = await registerUser(username);
    
    // 儲存用戶資訊
    addUser(username, {
      username,
      certificate,
      publicKey: certificate.publicKey,
      privateKey  // 儲存私鑰
    });

    // 返回私鑰和憑證給用戶
    res.status(201).json({
      message: 'User registered',
      privateKey,
      certificate
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Missing username' });
  }

  try {
    const user = getUser(username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 返回用戶資訊，包括私鑰
    res.json({
      message: 'Login successful',
      privateKey: user.privateKey
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.getUsers = (req, res) => {
  res.json(getAllUsers());
};
