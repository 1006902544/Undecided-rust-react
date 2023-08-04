const axios = require('axios');
var Minio = require('minio');
const router = require('koa-router')();

router.prefix('/manager');

/**
 * @openapi
 * /:
 *   post:
 *     description: upload file
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.post('/accessKey', async (ctx, next) => {
  try {
    const url = `http://${process.env.BACKEND_URL}:${process.env.BACKEND_PORT}/manager/upload/accessKey`;
    const res = await axios({ url, method: 'get', headers: ctx.headers });
    const minioClient = new Minio.Client({
      endPoint: res.data.data.endpoint,
      port: res.data.data.port,
      useSSL: res.data.data.use_ssl,
      accessKey: res.data.data.access_key,
      secretKey: res.data.data.secret_key,
    });
    console.log(minioClient);
    ctx.body = res?.data;
  } catch (err) {
    ctx.body = err.response?.data ?? err.message ?? 'error';
    ctx.status = err.response?.status ?? 404;
  }
});

module.exports = router;
