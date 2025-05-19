import api from './api';
import { generateKeyPair, exportPubKey } from '../crypto';

export async function register(username) {
  const keyPair = await generateKeyPair();
  const pubJwk  = await exportPubKey(keyPair.publicKey);
  await api.post('/register', { username, publicKey: pubJwk });
  return { user:{ username }, privateKey:keyPair.privateKey };
}

export async function login(username) {
  await api.post('/login', { username });
  // 假設使用者已經有私鑰 (demo 再生一把)
  const kp = await generateKeyPair();
  return { user:{ username }, privateKey:kp.privateKey };
}

export async function fetchUsers() {
  const res = await api.get('/users');
  return res.data;
}
