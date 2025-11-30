const { body, param } = require('express-validator');

const createUserValidation = [
  body('user')
    .notEmpty()
    .withMessage('Nazwa użytkownika jest wymagana'),
  body('password_hash')
    .isLength({ min: 6 })
    .withMessage('Hasło musi mieć co najmniej 6 znaków')
];

const userIdValidation = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('Id użytkownika musi być liczbą całkowitą większą od 0')
];

module.exports = {
  createUserValidation,
  userIdValidation
};
