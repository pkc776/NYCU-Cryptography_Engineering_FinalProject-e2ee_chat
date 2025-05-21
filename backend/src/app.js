const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');
const certRoutes = require('./routes/cert');

app.use(userRoutes);
app.use(messageRoutes);
app.use(certRoutes);


const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); // 路徑視你的檔案位置

// 路由與中介層
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
