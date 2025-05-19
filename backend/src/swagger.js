const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E2EE Chat API',
      version: '1.0.0',
      description: 'A simple Express API for an end-to-end encrypted chat system',
    },
  },
  apis: ['./src/routes/*.js'], // 對應你路由註解的位置
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
