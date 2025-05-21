const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sendMessage, getMessages } = require('./controllers/messageController');

const app = express();
const PORT = process.env.PORT || 3000;

// 配置 CORS
app.use(cors({
  origin: 'http://localhost:5173', // Vue 開發伺服器的預設端口
  credentials: false
}));

app.use(express.json());

const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');
const certRoutes = require('./routes/cert');

app.use(userRoutes);
app.use(messageRoutes);
app.use(certRoutes);

// 訊息路由
app.post('/message', sendMessage);
app.get('/message/:to', getMessages);

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); // 路徑視你的檔案位置

// 路由與中介層
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
