const router = require('koa-router')();
const swaggerUI = require('koa2-swagger-ui').koaSwagger;
const spec = require('@/openapi');
const swaggerSpec = require('../swagger.conf');

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

router.get('/doc', async (ctx) => {
  ctx.body = swaggerSpec;
});

module.exports = router;
