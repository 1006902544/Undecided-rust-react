const Koa = require('koa');
const app = new Koa();
const Minio = require('minio');

app.use(async (ctx, next) => {
  // const minioClient = new Minio.Client({
  //   endPoint: 'minio.zxc.cc',
  //   port: 80,
  //   useSSL: false,
  //   accessKey: 'nazabanma',
  //   secretKey: 'zdc86039606',
  // });
  ctx.body = '<h1>原神！ 启动！</h1>';
});

app.listen(8081, () => console.log('原神！  启动！'));
