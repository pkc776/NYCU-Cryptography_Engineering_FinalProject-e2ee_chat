const crypto = require('crypto');
const { promisify } = require('util');
const generateKeyPair = promisify(crypto.generateKeyPair);

// 根 CA 金鑰對
let rootCA = null;

// 初始化根 CA
async function initRootCA() {
  if (!rootCA) {
    rootCA = await generateKeyPair('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });
  }
  return rootCA;
}

// 獲取 CA 公鑰
async function getCAPublicKey() {
  const ca = await initRootCA();
  return ca.publicKey;
}

// 從 PEM 格式轉換為 JWK 格式
function pemToJwk(pem) {
  const key = crypto.createPublicKey(pem);
  const jwk = key.export({ format: 'jwk' });
  return jwk;
}

// 生成用戶金鑰對
async function generateUserKeyPair() {
  const keyPair = await generateKeyPair('ec', {
    namedCurve: 'P-256',
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });
  return keyPair;
}

// 生成 X.509 憑證
function generateCertificate(username, publicKey) {
  const tbs = {
    version: 2,
    serialNumber: crypto.randomBytes(16).toString('hex'),
    subject: {
      commonName: username
    },
    issuer: {
      commonName: 'Root CA'
    },
    notBefore: new Date(),
    notAfter: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1年有效期
    publicKey: publicKey,
    publicKeyJwk: pemToJwk(publicKey)
  };

  // 使用根 CA 私鑰簽署憑證
  const sign = crypto.createSign('SHA256');
  const tbsStr = JSON.stringify(tbs);
  sign.update(tbsStr);
  const signature = sign.sign(rootCA.privateKey, 'base64');

  return {
    tbs: Buffer.from(tbsStr).toString('base64'),
    signature,
    algorithm: {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256'
    },
    publicKeyJwk: tbs.publicKeyJwk
  };
}

// 註冊新用戶
async function registerUser(username) {
  // 初始化根 CA
  await initRootCA();

  // 生成用戶金鑰對
  const keyPair = await generateUserKeyPair();

  // 生成憑證
  const certificate = generateCertificate(username, keyPair.publicKey);

  return {
    username,
    privateKey: keyPair.privateKey,
    certificate
  };
}

module.exports = {
  registerUser,
  initRootCA,
  getCAPublicKey
}; 