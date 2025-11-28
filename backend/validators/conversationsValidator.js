const { body, param, query } = require('express-validator');

// POST
const createConversationValidation = [
  body('user_a_id')
    .isInt({ gt: 0 })
    .withMessage('user_a_id musi być liczbą całkowitą większą od 0'),
  body('user_b_id')
    .isInt({ gt: 0 })
    .withMessage('user_b_id musi być liczbą całkowitą większą od 0')
];

// PUT / PATCH / replace
const replaceConversationValidation = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('id konwersacji musi być liczbą całkowitą większą od 0'),
  body('user_a_id')
    .isInt({ gt: 0 })
    .withMessage('user_a_id musi być liczbą całkowitą większą od 0'),
  body('user_b_id')
    .isInt({ gt: 0 })
    .withMessage('user_b_id musi być liczbą całkowitą większą od 0'),
  body('last_message_at')
    .optional()
    .isISO8601()
    .withMessage('last_message_at musi być poprawną datą ISO8601')
];

// PATCH
const patchConversationValidation = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('id konwersacji musi być liczbą całkowitą większą od 0'),
  body('last_message_at')
    .notEmpty()
    .withMessage('last_message_at jest wymagane')
    .isISO8601()
    .withMessage('last_message_at musi być poprawną datą ISO8601')
];

// GET
const getAllValidation = [
  query('user_a_id')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('user_a_id musi być liczbą całkowitą większą od 0'),
  query('user_b_id')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('user_b_id musi być liczbą całkowitą większą od 0')
];

// GET / DELETE po ID
const idParamValidation = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('id konwersacji musi być liczbą całkowitą większą od 0')
];

module.exports = {
  createConversationValidation,
  replaceConversationValidation,
  patchConversationValidation,
  getAllValidation,
  idParamValidation
};
