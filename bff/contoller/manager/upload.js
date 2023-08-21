const axios = require('axios');
var Minio = require('minio');
const nanoid = import('nanoid');
const { updateMaterialImage } = require('./material');

const uploadImage = async (ctx, next) => {
  const file = ctx.file;
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

    const res = await new Promise((resolve, reject) => {
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
                const fileUrl = `http://${endPoint}:${port}/images/${fileName}`;
                resolve({
                  etag: res.etag,
                  fileName: fileName,
                  url: fileUrl,
                });
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
    const updateUrl = `http://${process.env.BACKEND_URL}:${process.env.BACKEND_PORT}/manager/materialLibrary/image`;
    await axios({
      url: updateUrl,
      method: 'POST',
      headers: {
        authorization: ctx.headers.authorization,
      },
      data: {
        e_tag: res.etag,
        file_name: res.fileName,
        file_url: res.url,
      },
    });
    ctx.body = {
      data: res,
      status: 200,
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      msg: err.message,
    };
  }
};

module.exports = {
  uploadImage,
};
