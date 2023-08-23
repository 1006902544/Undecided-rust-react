const axios = require('axios');
const { getOssAccessKey } = require('../../utils/getOssAccessKey.js');
const { materialService } = require('../../server');
const { materialSchema } = require('../../schema');

const updateMaterialImage = async (ctx, data) => {
  const url = `http://${process.env.BACKEND_URL}:${process.env.BACKEND_PORT}/manager/materialLibrary/image`;
  const res = await axios({
    url: url,
    method: 'post',
    headers: {
      ...ctx.headers,
      'Content-Type': 'application/json;charset=utf-8',
    },
    data,
  });
  return res;
};

const deleteMaterialImage = async (ctx) => {
  try {
    const { value } = materialSchema.DeleteImageReq.validate(ctx.query);
    const fileName = value.fileName;
    const { minioClient } = await getOssAccessKey(ctx);
    await materialService.deleteImage(ctx, { minioClient, fileName });
    ctx.status = 200;
    ctx.body = {
      message: 'Delete success',
      status: 200,
    };
  } catch (err) {
    const message =
      err.response?.data?.message || err.message || err.toString();
    const status = err.response?.data?.status || 500;
    ctx.status = status;
    ctx.body = {
      message,
      status,
    };
  }
};

module.exports = {
  updateMaterialImage,
  deleteMaterialImage,
};
