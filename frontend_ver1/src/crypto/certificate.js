// verifyCertificate(cert, caPubSpkiB64)
// cert = { tbs: base64, signature: base64, alg: { name:'RSASSA-PKCS1-v1_5', hash:'SHA-256' }, publicKeyJwk: {...} }
// caPubSpkiB64: base64 encoded SPKI bytes of root CA public key
export async function verifyCertificate(cert, caPubSpkiB64) {
  if (!caPubSpkiB64) return true; // demo: skip if not provided

  const spki = Uint8Array.from(atob(caPubSpkiB64), c=>c.charCodeAt(0));
  const caKey = await crypto.subtle.importKey(
    'spki', spki,
    cert.alg,
    false, ['verify']
  );

  const sig = Uint8Array.from(atob(cert.signature), c=>c.charCodeAt(0));
  const tbs = Uint8Array.from(atob(cert.tbs), c=>c.charCodeAt(0));

  return crypto.subtle.verify(cert.alg, caKey, sig, tbs);
}
