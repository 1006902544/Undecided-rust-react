const Joi = require('joi');

module.exports = {
  DeleteImageReq: Joi.object({
    fileName: Joi.string().required(),
  }),
  BatchDeleteImageReq: Joi.object({
    filenames: Joi.array().items(Joi.string()).min(1).required(),
  }),
};
