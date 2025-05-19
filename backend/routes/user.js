const express = require('express');
const router = express.Router();
const { register, getUsers } = require('../controllers/userController');

router.post('/register', register);
// backend/routes/user.js
router.post('/login', (req, res) => {
  const { username } = req.body;
  // 這裡你要做自己的驗證 (密碼 / token ...)
  return res.json({ message: 'ok' });
});

router.get('/users', getUsers);

module.exports = router;
