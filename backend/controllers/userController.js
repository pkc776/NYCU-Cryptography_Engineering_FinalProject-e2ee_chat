const { addUser, getAllUsers } = require('../storage/users');

exports.register = (req, res) => {
  const { username, publicKey } = req.body;
  if (!username || !publicKey) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  addUser(username, publicKey);
  res.status(201).json({ message: 'User registered' });
};

exports.getUsers = (req, res) => {
  res.json(getAllUsers());
};
