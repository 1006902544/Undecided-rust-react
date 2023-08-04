const router = require('koa-router')();

router.prefix('/manager');

router.post('/upload', async (ctx, next) => {
  ctx.body = '';
});

module.exports = router;
