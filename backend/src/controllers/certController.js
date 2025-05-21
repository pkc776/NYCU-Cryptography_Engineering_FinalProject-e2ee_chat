const { getUser } = require('../storage/users');
const { getCAPublicKey } = require('../services/kms');

exports.getCert = (req, res) => {
  const userID = req.params.userID;
  console.log('Fetching certificate for user:', userID);
  
  const user = getUser(userID);
  console.log('User found:', !!user);
  
  if (!user) {
    console.error('User not found:', userID);
    return res.status(404).json({ error: 'User not found' });
  }
  
  if (!user.certificate) {
    console.error('No certificate found for user:', userID);
    return res.status(404).json({ error: 'Certificate not found' });
  }

  console.log('Certificate details:', {
    hasTbs: !!user.certificate.tbs,
    hasSignature: !!user.certificate.signature,
    hasAlg: !!user.certificate.alg,
    hasPublicKeyJwk: !!user.certificate.publicKeyJwk,
    publicKeyJwkType: user.certificate.publicKeyJwk?.kty,
    publicKeyJwkCurve: user.certificate.publicKeyJwk?.crv
  });

  res.json(user.certificate);
};

exports.getCAPublicKey = async (req, res) => {
  try {
    const publicKey = await getCAPublicKey();
    res.json({ publicKey });
  } catch (error) {
    console.error('Error getting CA public key:', error);
    res.status(500).json({ error: 'Failed to get CA public key' });
  }
};
