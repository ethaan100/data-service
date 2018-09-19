const Joi = require('../../../utils/validation/joi');
const { BigNumber } = require('@waves/data-entities');

const commonFilters = require('../../presets/pg/searchWithPagination/commonFilterSchemas');

const result = Joi.object().keys({
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
    .allow('')
    .allow(null),
  proofs: Joi.when('signature', {
    is: Joi.only(['', null]),
    then: Joi.array().min(1),
    otherwise: Joi.array().length(0),
  }).required(),
  id: Joi.string()
    .base58()
    .required(),
  asset_id: Joi.string()
    .base58()
    .required(),
  attachment: Joi.string()
    .required()
    .allow(''),
  sender: Joi.string().required(),
  sender_public_key: Joi.string().required(),
  recipients: Joi.array().items(Joi.string().base58()),
  amounts: Joi.array().items(
    Joi.object()
      .bignumber()
      .required()
  ),
});

const inputSearch = Joi.object()
  .keys({
    ...commonFilters,
    sender: Joi.string(),
    assetId: Joi.string().base58(),
    recipient: Joi.string(),
  })
  .required();

module.exports = { result, inputSearch };
