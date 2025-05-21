const users = new Map();

function getUser(username) {
  return users.get(username);
}

function addUser(username, publicKey) {
  users.set(username, { username, publicKey });
}

function getAllUsers() {
  return Array.from(users.values());
}

module.exports = {
  getUser,
  addUser,
  getAllUsers
};
