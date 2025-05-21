import { defineStore } from 'pinia';
import { importPubKey, deriveSharedKey, encrypt, decrypt, verifyCertificate } from '../crypto';
import api from '../services/api';
import { fetchCertificate } from '../services/cert';

export const useChatStore = defineStore('chat', {
  state: () => ({ 
    sessions: {},  // 儲存會話金鑰
    messages: {}   // 儲存訊息歷史
  }),

  actions: {
    async ensureKey(partner, auth) {
      console.log('Ensuring key for partner:', partner);
      if (this.sessions[partner]) {
        console.log('Using existing session key');
        return this.sessions[partner];
      }

      try {
        // 1. 取對方憑證並驗章
        console.log('Fetching certificate for:', partner);
        const cert = await fetchCertificate(partner);
        if (!cert) {
          throw new Error('Failed to fetch certificate');
        }
        console.log('Certificate received:', cert);
        
        const ok = await verifyCertificate(cert, import.meta.env.VITE_CA_PUB);
        if (!ok) {
          throw new Error('Certificate verification failed');
        }
        console.log('Certificate verified');

        // 2. 匯入對方公開鍵
        console.log('Importing public key');
        const peerPub = await importPubKey(cert.publicKeyJwk);
        if (!peerPub) {
          throw new Error('Failed to import public key');
        }

        // 3. ECDH 產生 session key
        console.log('Deriving session key');
        const key = await deriveSharedKey(auth.privateKey, peerPub);
        if (!key) {
          throw new Error('Failed to derive session key');
        }
        this.sessions[partner] = key;
        console.log('Session key established');
        return key;
      } catch (error) {
        console.error('Error ensuring key:', error);
        throw error;
      }
    },

    addMessage(partner, msg) {
      console.log('Adding message:', { partner, msg });
      if (!this.messages[partner]) {
        this.messages[partner] = [];
      }
      // 避免重複訊息
      const isDuplicate = this.messages[partner].some(
        m => m.from === msg.from && m.ts === msg.ts
      );
      if (!isDuplicate) {
        this.messages[partner].push(msg);
        // 按時間排序
        this.messages[partner].sort((a, b) => a.ts - b.ts);
        // 強制更新 messages 物件
        this.messages = { ...this.messages };
        console.log('Message added to history:', this.messages[partner]);
      } else {
        console.log('Duplicate message ignored');
      }
    },

    async send(partner, text, auth) {
      console.log('Sending message to:', partner);
      try {
        if (!auth.privateKey) {
          throw new Error('No private key available');
        }

        const key = await this.ensureKey(partner, auth);
        if (!key) {
          throw new Error('Failed to establish session key');
        }

        console.log('Encrypting message');
        const { iv, ct } = await encrypt(key, text);
        if (!iv || !ct) {
          throw new Error('Encryption failed');
        }
        console.log('Message encrypted:', { iv: iv.substring(0, 20) + '...', ct: ct.substring(0, 20) + '...' });

        console.log('Sending to server:', {
          from: auth.user.username,
          to: partner,
          hasIv: !!iv,
          hasContent: !!ct
        });

        const response = await api.post('/message', {
          from: auth.user.username,
          to: partner,
          iv,
          content: ct
        });

        if (!response.data) {
          throw new Error('No response from server');
        }
        console.log('Server response:', response.data);

        // 添加訊息到本地歷史記錄
        this.addMessage(partner, {
          from: auth.user.username,
          text,
          ts: Date.now()
        });
        console.log('Message added to history');
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    },

    async fetchOffline(auth) {
      console.log('=== 開始獲取訊息 ===');
      console.log('當前使用者:', auth.user.username);
      
      try {
        const res = await api.get(`/message/${encodeURIComponent(auth.user.username)}`);
        const list = res.data;
        console.log('從伺服器獲取的訊息列表:', list);
        
        for (const msg of list) {
          try {
            console.log('處理訊息:', {
              發送者: msg.from,
              接收者: msg.to,
              時間戳: msg.timestamp
            });

            // 只處理發給當前使用者的訊息
            if (msg.to !== auth.user.username) {
              console.log('跳過非發給當前使用者的訊息');
              continue;
            }

            console.log('開始解密訊息...');
            console.log('確保與發送者的會話金鑰...');
            const key = await this.ensureKey(msg.from, auth);
            if (!key) {
              console.error('無法獲取會話金鑰');
              continue;
            }
            console.log('會話金鑰已獲取');

            console.log('開始解密...');
            console.log('IV:', msg.iv);
            console.log('Content:', msg.content);
            const plain = await decrypt(key, msg.iv, msg.content);
            console.log('訊息解密成功:', plain);
            
            // 直接使用發送者作為對話對象
            const partner = msg.from;
            console.log('將訊息添加到與', partner, '的對話中');
            
            this.addMessage(partner, {
              from: msg.from,
              text: plain,
              ts: msg.timestamp || Date.now()
            });
            console.log('訊息已添加到對話歷史');
          } catch (error) {
            console.error('處理訊息時發生錯誤:', error);
            console.error('錯誤詳情:', error.message);
          }
        }
        console.log('=== 訊息獲取完成 ===');
      } catch (error) {
        console.error('獲取訊息時發生錯誤:', error);
      }
    }
  }
});
