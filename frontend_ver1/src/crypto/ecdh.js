export async function generateKeyPair() {
  try {
    console.log('Generating ECDH key pair');
    const keyPair = await crypto.subtle.generateKey(
      { name: 'ECDH', namedCurve: 'P-256' },
      false,
      ['deriveKey', 'deriveBits']
    );
    console.log('Key pair generated successfully');
    return keyPair;
  } catch (error) {
    console.error('Error generating key pair:', error);
    throw error;
  }
}

export async function exportPubKey(pubKey) {
  try {
    console.log('Exporting public key');
    const jwk = await crypto.subtle.exportKey('jwk', pubKey);
    console.log('Public key exported successfully');
    return jwk;
  } catch (error) {
    console.error('Error exporting public key:', error);
    throw error;
  }
}

export async function importPubKey(jwk) {
  try {
    console.log('Importing public key:', {
      kty: jwk.kty,
      crv: jwk.crv,
      hasX: !!jwk.x,
      hasY: !!jwk.y
    });
    const key = await crypto.subtle.importKey(
      'jwk', jwk,
      { name: 'ECDH', namedCurve: 'P-256' },
      false,
      []
    );
    console.log('Public key imported successfully');
    return key;
  } catch (error) {
    console.error('Error importing public key:', error);
    throw error;
  }
}

export async function importPrivateKey(pem) {
  try {
    console.log('Importing private key from PEM');
    // 移除 PEM 格式的頭尾和換行符
    const base64 = pem
      .replace('-----BEGIN PRIVATE KEY-----', '')
      .replace('-----END PRIVATE KEY-----', '')
      .replace(/\n/g, '');
    
    // 將 base64 轉換為 ArrayBuffer
    const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    
    // 匯入私鑰
    const key = await crypto.subtle.importKey(
      'pkcs8',
      binary,
      { name: 'ECDH', namedCurve: 'P-256' },
      false,
      ['deriveKey', 'deriveBits']
    );
    console.log('Private key imported successfully');
    return key;
  } catch (error) {
    console.error('Error importing private key:', error);
    throw error;
  }
}

export async function deriveSharedKey(priv, pub) {
  try {
    console.log('Deriving shared key');
    const key = await crypto.subtle.deriveKey(
      { name: 'ECDH', public: pub },
      priv,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    console.log('Shared key derived successfully');
    return key;
  } catch (error) {
    console.error('Error deriving shared key:', error);
    throw error;
  }
}
