// src/stores/auth.js
import { defineStore } from 'pinia';
import {
  register as apiRegister,
  login    as apiLogin,
  fetchUsers
} from '../services/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,         // { username }
    privateKey: null,   // CryptoKey
    users: []           // [{ username, publicKey }]
  }),

  getters: {
    isLoggedIn: (s) => !!s.user
  },

  actions: {
    /** 註冊：產生 ECDH 金鑰 + 上傳公鑰 */
    async register (username) {
      const { user, privateKey } = await apiRegister(username);
      this.user       = user;
      this.privateKey = privateKey;
    },

    /** 登入：取回清單 */
    async login (username) {
      const { user, privateKey } = await apiLogin(username);
      this.user       = user;
      this.privateKey = privateKey;
      await this.loadUsers();   // 拉一次 /users
    },

    async loadUsers () {
      this.users = await fetchUsers();
    }
  }
});
