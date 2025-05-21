const { getUser } = require('../storage/users');

exports.getCert = (req, res) => {
  const userID = req.params.userID;
  const user = getUser(userID);
  if (!user || !user.certificate) {
    return res.status(404).json({ error: 'Certificate not found' });
  }

  res.json({
    userID,
    certificate: user.certificate  // 可以是 base64 格式的 X.509 DER
  });
};
