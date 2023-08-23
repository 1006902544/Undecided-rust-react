const Joi = require('joi');

module.exports = {
  DeleteImageReq: Joi.object({
    fileName: Joi.string().required(),
  }),
};
