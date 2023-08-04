const router = require('koa-router')();
const swaggerUI = require('koa2-swagger-ui').koaSwagger;
const spec = require('../openapi');

router.prefix('/openapi');

router.get(
  '/',
  swaggerUI({
    routePrefix: false,
    swaggerOptions: {
      spec,
    },
  })
);

module.exports = router;
