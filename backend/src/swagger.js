const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E2EE Chat API',
      version: '1.0.0',
      description: 'API for the End-to-End Encrypted Chat Project',
    },
  },
  apis: ['./src/routes/*.js'], // 自動掃描路由註解產生文件
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
// console.log(swaggerSpec.paths);

