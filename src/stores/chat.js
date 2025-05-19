import { defineStore } from 'pinia';
import { importPubKey, deriveSharedKey, encrypt, decrypt, verifyCertificate } from '../crypto';
import api from '../services/api';
import { fetchCertificate } from '../services/cert';

export const useChatStore = defineStore('chat', {
  state: () => ({ sessions:{}, messages:{} }),
  actions: {
    async ensureKey(partner, auth) {
      if (this.sessions[partner]) return this.sessions[partner];

      // 1. 取對方憑證並驗章
      const cert = await fetchCertificate(partner);
      const ok = await verifyCertificate(cert, import.meta.env.VITE_CA_PUB);
      if (!ok) throw new Error('Certificate verify failed');

      // 2. 匯入對方公開鍵
      const peerPub = await importPubKey(cert.publicKeyJwk);

      // 3. ECDH 產生 session key
      const key = await deriveSharedKey(auth.privateKey, peerPub);
      this.sessions[partner] = key;
      return key;
    },

    addMessage(partner, msg) {
      if(!this.messages[partner]) this.messages[partner]=[];
      this.messages[partner].push(msg);
    },

    async send(partner, text, auth) {
      const key = await this.ensureKey(partner, auth);
      const { iv, ct } = await encrypt(key, text);

      await api.post('/message', {
        from: auth.user.username,
        to  : partner,
        iv,
        content: ct
      });

      this.addMessage(partner, { from: auth.user.username, text, ts: Date.now() });
    },

    async fetchOffline(auth) {
      const res = await api.get(`/message/${encodeURIComponent(auth.user.username)}`);
      const list = res.data;
      for (const p of list) {
        const key = await this.ensureKey(p.from, auth);
        const plain = await decrypt(key, p.iv, p.content);
        this.addMessage(p.from, { from:p.from, text:plain, ts:p.ts });
      }
    }
  }
});
