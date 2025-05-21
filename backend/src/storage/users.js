const users = new Map();

function addUser(username, userData) {
  console.log('Adding user:', username);
  users.set(username, userData);
  console.log('Current users:', Array.from(users.keys()));
}

function getUser(username) {
  console.log('Getting user:', username);
  const user = users.get(username);
  console.log('User found:', !!user);
  if (user) {
    console.log('User data:', {
      hasCertificate: !!user.certificate,
      hasPrivateKey: !!user.privateKey
    });
  }
  return user;
}

function getAllUsers() {
  console.log('Getting all users');
  const userList = Array.from(users.values()).map(({ username, certificate }) => ({
    username,
    certificate,
    status: 'online'
  }));
  console.log('User list:', userList.map(u => u.username));
  return userList;
}

module.exports = {
  addUser,
  getUser,
  getAllUsers
};
