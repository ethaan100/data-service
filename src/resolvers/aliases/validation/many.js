const { input, output } = require('./schema/many');
const { AppError } = require('../../../errorHandling');
const { validate } = require('../../../utils/validation');

// validateInput :: Options -> Boolean
const validateInput = validate(input, (error, value) =>
  AppError.Validation('Input validation failed', {
    resolver: 'aliasesMany',
    error,
    value,
  })
);

// validateResult :: Result -> Boolean
const validateResult = validate(output, (error, value) =>
  AppError.Resolver('Result validation failed', {
    resolver: 'aliasesMany',
    value,
    error,
  })
);

module.exports = {
  validateInput,
  validateResult,
};
