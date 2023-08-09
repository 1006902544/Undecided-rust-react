const axios = require('axios');
var Minio = require('minio');
const router = require('koa-router')();
// const { UploadReq } = require('@/schema/upload');
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
router.post('/upload', upload.single('file'), async (ctx, next) => {
  const file = ctx.file;
  console.log(file);
  const id = (await nanoid).nanoid(10);
  const fileName = `${id}-${file.originalname}`;

  try {
    const url = `http://${process.env.BACKEND_URL}:${process.env.BACKEND_PORT}/manager/upload/accessKey`;
    const access = await axios({
      url,
      method: 'get',
      headers: ctx.headers,
    });
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
            file.buffer,
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
                resolve(ctx);
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
});

module.exports = router;
