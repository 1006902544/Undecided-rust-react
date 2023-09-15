const axios = require('axios');
const nanoid = import('nanoid');
const { getOssAccessKey } = require('../../utils/getOssAccessKey.js');

const uploadImage = async (ctx, next) => {
  const file = ctx.file;
  const id = (await nanoid).nanoid(10);
  const fileName = Buffer.from(`${id}-${file.originalname}`, 'latin1').toString(
    'utf8'
  );

  try {
    const { minioClient, accessData } = await getOssAccessKey(ctx);

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
                const fileUrl = `http://${accessData.endPoint}:${accessData.port}/images/${fileName}`;
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
    ctx.status = err.response?.data?.status || 500;
    ctx.body = {
      msg: err.response?.data?.message || err.message,
    };
  }
};

module.exports = {
  uploadImage,
};
