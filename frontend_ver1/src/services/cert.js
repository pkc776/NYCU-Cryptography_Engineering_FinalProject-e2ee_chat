import api from './api';

export async function fetchCertificate(username) {
  const res = await api.get(`/cert/${encodeURIComponent(username)}`);
  return res.data; // expected { tbs, signature, alg, publicKeyJwk }
}
