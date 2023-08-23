const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const swaggerDefinition = {
  info: {
    // 自定义文档信息
    title: 'bff',
    version: '1.0.0',
    description: 'backend for frontend',
  },
  host: `127.0.0.1:8081`, // 指定项目地址，建议在环境参数中配置，然后用 process.env 读取
  basePath: '/',
};

const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, './routes/*.js')], // 指定项目路由的相对路径，相对于 basePath
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
