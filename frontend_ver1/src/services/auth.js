import api from './api';
import { generateKeyPair, exportPubKey, importPrivateKey } from '../crypto';

export async function register(username) {
  const res = await api.post('/register', { username });
  const privateKey = await importPrivateKey(res.data.privateKey);
  return {
    user: { username },
    privateKey,
    certificate: res.data.certificate
  };
}

export async function login(username) {
  const res = await api.post('/login', { username });
  const privateKey = await importPrivateKey(res.data.privateKey);
  return {
    user: { username },
    privateKey
  };
}

export async function fetchUsers() {
  const res = await api.get('/users');
  return res.data;
}
