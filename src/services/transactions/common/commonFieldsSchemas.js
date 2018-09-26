const Joi = require('../../../utils/validation/joi');

module.exports = {
  id: Joi.string()
    .base58()
    .required(),
  height: Joi.number().required(),
  tx_type: Joi.number().required(),
  tx_version: Joi.number()
    .required()
    .allow(null),
  fee: Joi.object()
    .bignumber()
    .required(),
  time_stamp: Joi.date().required(),
  signature: Joi.string()
    .required()
    .allow(null),
  proofs: Joi.when('signature', {
    is: null,
    then: Joi.array(),
    otherwise: Joi.array().length(0),
  }).required(),

  sender: Joi.string().required(),
  sender_public_key: Joi.string().required(),
};