const { body, param, query } = require('express-validator');

// Walidacja przy POST
const createUserGroupValidation = [
  body('user_id')
    .isInt({ gt: 0 })
    .withMessage('user_id musi być liczbą całkowitą większą od 0'),
  body('group_id')
    .isInt({ gt: 0 })
    .withMessage('group_id musi być liczbą całkowitą większą od 0')
];

// Walidacja PUT / PATCH / replace
const updateUserGroupValidation = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('id relacji musi być liczbą całkowitą większą od 0'),
  body('user_id')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('user_id musi być liczbą całkowitą większą od 0'),
  body('group_id')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('group_id musi być liczbą całkowitą większą od 0')
];

// Walidacja GET
const getAllValidation = [
  query('user_id')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('user_id musi być liczbą całkowitą większą od 0'),
  query('group_id')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('group_id musi być liczbą całkowitą większą od 0')
];

const idParamValidation = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('id relacji musi być liczbą całkowitą większą od 0')
];

module.exports = {
  createUserGroupValidation,
  updateUserGroupValidation,
  getAllValidation,
  idParamValidation
};
