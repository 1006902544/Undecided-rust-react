const axios = require('axios');
const Minio = require('minio');

const getOssAccessKey = async (ctx) => {
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
  return { minioClient, accessData: { endPoint, port } };
};

module.exports = {
  getOssAccessKey,
};
