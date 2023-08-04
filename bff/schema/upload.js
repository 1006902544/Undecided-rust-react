const Joi = require('joi');

module.exports = {
  UploadReq: Joi.object({
    file: Joi.string().base64().required(),
    name: Joi.string().base64().required(),
  }),
};
