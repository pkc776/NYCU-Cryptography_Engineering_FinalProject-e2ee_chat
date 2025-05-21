export async function encrypt(key, plaintext) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(plaintext);
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
  return {
    iv: btoa(String.fromCharCode(...iv)),
    ct: btoa(String.fromCharCode(...new Uint8Array(cipher)))
  };
}

export async function decrypt(key, ivB64, ctB64) {
  const iv = Uint8Array.from(atob(ivB64), c=>c.charCodeAt(0));
  const data = Uint8Array.from(atob(ctB64), c=>c.charCodeAt(0));
  const plain = await crypto.subtle.decrypt({ name:'AES-GCM', iv }, key, data);
  return new TextDecoder().decode(plain);
}
