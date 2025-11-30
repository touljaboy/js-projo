const { body, param } = require('express-validator');

// POST
const createMessageValidation = [
  body('user_id')
    .isInt({ gt: 0 })
    .withMessage('user_id musi być liczbą całkowitą większą od 0'),
  body('group_id')
    .isInt({ gt: 0 })
    .withMessage('group_id musi być liczbą całkowitą większą od 0'),
  body('message_content')
    .notEmpty()
    .withMessage('Treść wiadomości nie może być pusta')
];

// PATCH 
const patchMessageValidation = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('id wiadomości musi być liczbą całkowitą większą od 0'),
  body('message_content')
    .notEmpty()
    .withMessage('Treść wiadomości nie może być pusta')
];

// GET / DELETE po ID
const idParamValidation = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('id wiadomości musi być liczbą całkowitą większą od 0')
];

module.exports = {
  createMessageValidation,
  patchMessageValidation,
  idParamValidation
};
