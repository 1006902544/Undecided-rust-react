const axios = require('axios');
var Minio = require('minio');
const router = require('koa-router')();
const { UploadReq } = require('@/schema/upload');
router.prefix('/manager');
const multer = require('@koa/multer');
const nanoid = import('nanoid');
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

    const id = (await nanoid).nanoid(10);
    const fileName = `${id}-${file.originalName}`;

    try {
      const url = `http://${process.env.BACKEND_URL}:${process.env.BACKEND_PORT}/manager/upload/accessKey`;
      const access = await axios({
        url,
        method: 'get',
        headers: ctx.headers,
      });
      console.log(access);
      const endPoint = access.data.data.endpoint;
      const port = access.data.data.port;
      const minioClient = new Minio.Client({
        endPoint,
        port,
        useSSL: access.data.data.use_ssl,
        accessKey: access.data.data.access_key,
        secretKey: access.data.data.secret_key,
      });

      var metaData = {
        'Content-Type': 'application/octet-stream',
        // 'X-Amz-Meta-Testing': 1234,
        // example: 5678,
      };

      await new Promise((resolve, reject) => {
        minioClient.bucketExists('images', function (err, exists) {
          if (err) {
            ctx.throw(404);
            ctx.body = {
              message: err.message,
            };
            reject(err);
          }
          if (exists) {
            minioClient.putObject(
              'images',
              fileName,
              file.stream,
              metaData,
              (err, res) => {
                if (res) {
                  ctx.body = {
                    data: {
                      etag: res.etag,
                      url: `http://${endPoint}:${port}/images/${fileName}`,
                      fileName,
                    },
                    status: 200,
                  };
                  resolve();
                }
                if (err) {
                  ctx.status = 500;
                  ctx.body = {
                    message: err.message,
                    status: 500,
                  };
                  reject(err);
                }
              }
            );
          }
        });
      });
    } catch (err) {
      ctx.status = 500;
      ctx.body = {
        msg: err.message,
      };
    }
  }
);

module.exports = router;
