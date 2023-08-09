require('module-alias/register');
const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const auth = require('@/middleware/auth');
const cors = require('koa2-cors');
const index = require('./routes/index');
const openapi = require('./routes/openapi');
const manager = require('./routes/manager');

// error handler
onerror(app);

// middlewares
app.use(
  cors({
    origin: '*',
    // 必要配置
    credentials: true,
  })
);

// app.use(koaBody({ multipart: true }));

app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
    encode: 'utf-8',
  })
);
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(
  views(__dirname + '/views', {
    extension: 'pug',
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;

  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(auth);

// routes
app.use(index.routes(), index.allowedMethods());
app.use(openapi.routes(), openapi.allowedMethods());
app.use(manager.routes(), manager.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
