const axios = require('axios');

const deleteImage = async (ctx, { minioClient, fileName }) => {
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
        minioClient.removeObject('images', fileName, (err, res) => {
          if (err) {
            ctx.status = 500;
            ctx.body = {
              message: err.message,
              status: 500,
            };
            reject(err);
          }

          resolve();
        });
      }
    });
  });

  const url = `http://${process.env.BACKEND_URL}:${process.env.BACKEND_PORT}/manager/materialLibrary/image?file_name=${fileName}`;
  await axios({
    method: 'DELETE',
    url,
    headers: ctx.headers,
  });
};

module.exports = {
  deleteImage,
};
