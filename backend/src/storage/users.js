const users = [];

function addUser(username, publicKey) {
  users.push({ username, publicKey });
}

function getAllUsers() {
  return users;
}

module.exports = { addUser, getAllUsers };
