const { body, param } = require('express-validator');

// POST
const createGroupValidation = [
  body('name')
    .notEmpty()
    .withMessage('Nazwa grupy jest wymagana'),
  body('is_public')
    .isBoolean()
    .withMessage('is_public musi być wartością boolean'),
  body('password')
    .optional()
    .isString()
    .withMessage('Hasło musi być tekstem')
];

// PUT
const replaceGroupValidation = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('id grupy musi być liczbą całkowitą większą od 0'),
  body('name')
    .notEmpty()
    .withMessage('Nazwa grupy jest wymagana'),
  body('is_public')
    .isBoolean()
    .withMessage('is_public musi być wartością boolean'),
  body('password')
    .optional()
    .isString()
    .withMessage('Hasło musi być tekstem')
];

// GET / DELETE po ID
const idParamValidation = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('id grupy musi być liczbą całkowitą większą od 0')
];

module.exports = {
  createGroupValidation,
  replaceGroupValidation,
  idParamValidation
};
