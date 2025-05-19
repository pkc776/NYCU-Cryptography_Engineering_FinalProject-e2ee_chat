const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');

app.use(userRoutes);
app.use(messageRoutes);

// Swagger UI 掛載
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
