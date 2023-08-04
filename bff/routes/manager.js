const axios = require('axios');
var Minio = require('minio');
const router = require('koa-router')();
const { UploadReq } = require('@/schema/upload');
router.prefix('/manager');
const multer = require('@koa/multer');
const upload = multer();

/**
 * @openapi
 * /:
 *   post:
 *     description: upload file
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.post(
  '/upload',
  upload.fields([{ name: 'file', maxCount: 1 }]),
  async (ctx, next) => {
    const file = ctx.files?.file?.at(-1);
    try {
      const url = `http://${process.env.BACKEND_URL}:${process.env.BACKEND_PORT}/manager/upload/accessKey`;
      const access = await axios({ url, method: 'get', headers: ctx.headers });
      const minioClient = new Minio.Client({
        endPoint: access.data.data.endpoint,
        port: access.data.data.port,
        useSSL: access.data.data.use_ssl,
        accessKey: 'access.data.data.access_key',
        secretKey: access.data.data.secret_key,
      });

      console.log(minioClient);

      var metaData = {
        'Content-Type': 'application/octet-stream',
        // 'X-Amz-Meta-Testing': 1234,
        // example: 5678,
      };

      minioClient.bucketExists('mybucket', function (err, exists) {
        if (err) {
          return console.log(err);
        }
        if (exists) {
          return console.log('Bucket exists.');
        }
      });

      ctx.body = access?.data;
    } catch (err) {
      ctx.body = err.response?.data ?? err.message ?? 'error';
      ctx.status = err.response?.status ?? 404;
    }
  }
);

module.exports = router;
