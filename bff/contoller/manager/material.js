const axios = require('axios');

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

module.exports = {
  updateMaterialImage,
};
