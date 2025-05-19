# NYCU Crypto Engineering Final Project
    This is a repo for NYCU-Cryptography_Engineering_FinalProject-e2ee_chat final project.

# FRONTEND_VER1

Vue 3 + Vite 前端，使用 **原生 WebCrypto API** 完成：

* **ECDH (P‑256)**：註冊時產生身分金鑰，登入後與對方公鑰推導會話對稱金鑰。
* **AES‑256‑GCM**：所有訊息加密後 `POST /message`，伺服器僅存密文。
* **憑證流程占位**：`services/cert.js` + `crypto/verifyCertificate`，待後端提供 `/cert/:user` 時即可啟用驗章。
* **Pinia** 管理目前使用者、私鑰、會話金鑰、聊天室訊息。
* 沒有任何第三方加密函式庫，全數透過 `window.crypto.subtle`.

啟動：
```bash
cd FRONTEND_VER1
npm install
npm run dev           # http://localhost:5173
```

依賴的後端端點（Port 3000；`vite.config.js` 已 proxy）：
* `POST /register`   { username, publicKey }
* `POST /login`      { username }
* `GET  /users`      → [{ username, publicKey }]
* `POST /message`    { from,to,iv,ct }
* `GET  /message/:to`
* *(預留)* `GET /cert/:user`

# Structure

FRONTEND_VER1/
├─ package.json               ← 前端依賴與 script (vite dev / build)
├─ vite.config.js             ← dev-server 設定 (port 5173, proxy 到 :3000)
├─ postcss.config.js + tailwind.config.js
├─ index.html                 ← SPA 主頁
└─ src/
   ├─ main.js                 ← 建立 app、Pinia、Router
   ├─ App.vue                 ← 單一 <router-view/>
   ├─ router.js               ← /login /register /  路由 & 守衛
   ├─ assets/style.css        ← Tailwind directives
   │
   ├─ crypto/                 ← **全部原生 WebCrypto**
   │   ├─ ecdh.js             • generateKey(P-256) • deriveSharedKey
   │   ├─ aes.js              • encrypt/decrypt (AES-GCM 256) + base64
   │   ├─ certificate.js      • verifyCertificate(…)，目前若無 CA 則 always true
   │   └─ index.js            ← re-export 上述函式
   │
   ├─ services/               ← 和後端 API 溝通 (axios)
   │   ├─ api.js              • axios instance (baseURL http://localhost:3000)
   │   ├─ auth.js             • /register /login /users
   │   └─ cert.js             • 下載 /cert/:user  (尚未實作時會 404，被 catch)
   │
   ├─ stores/                 ← Pinia 狀態
   │   ├─ auth.js             • current user / 私鑰 / users 清單
   │   └─ chat.js             • sessions: username→AES Key  
   │                         • ensureSessionKey() ︰<br>   - 先抓憑證驗章 (404 fallback)<br>   - ECDH derive AES key  
   │                         • sendMessage() ︰加密後 POST /message  
   │                         • decryptIncoming() ︰GET /message/:me 解密
   │
   ├─ components/
   │   ├─ Auth/
   │   │   ├─ LoginForm.vue       ← 輸入 username → auth.login()
   │   │   └─ RegisterForm.vue    ← 產生金鑰 → 上傳公鑰 → auth.register()
   │   ├─ Chat/
   │   │   ├─ UserList.vue        ← 左欄聯絡人
   │   │   ├─ ChatWindow.vue      ← 組合 Bubble+Input
   │   │   ├─ ChatBubble.vue      ← 單則訊息氣泡（判斷 mine/peer）
   │   │   └─ ChatInput.vue       ← textarea + send
   │   └─ Security/
   │       └─ SecurityBadge.vue   ← 🔒 Secure 標誌（單純 UI）
   │
   └─ views/                    ← Router Pages
       ├─ LoginView.vue
       ├─ RegisterView.vue
       └─ HomeView.vue          ← 聊天主畫面 (UserList + ChatWindow)
