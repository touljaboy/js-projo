const { body, param } = require('express-validator');

// POST 
const createMessageValidation = [
  body('sender_id')
    .isInt({ gt: 0 })
    .withMessage('sender_id musi być liczbą całkowitą większą od 0'),

  body('message_content')
    .notEmpty()
    .withMessage('Treść wiadomości nie może być pusta')
    .isString()
    .withMessage('Treść musi być tekstem'),

  body('conversation_id')
    .optional({ nullable: true })
    .isInt({ gt: 0 })
    .withMessage('conversation_id musi być liczbą > 0'),

  body('receiver_group_id')
    .optional({ nullable: true })
    .isInt({ gt: 0 })
    .withMessage('receiver_group_id musi być liczbą > 0'),

  body().custom((value, { req }) => {
    const conversationId = req.body.conversation_id;
    const groupId = req.body.receiver_group_id;

    // czy wartości istnieją
    const hasConversation = !!conversationId;
    const hasGroup = !!groupId;

    // oba są podane
    if (hasConversation && hasGroup) {
      throw new Error('Wiadomość nie może być jednocześnie do konwersacji prywatnej i grupy.');
    }

    // zadne nie jest podane 
    if (!hasConversation && !hasGroup) {
      throw new Error('Musisz podać conversation_id (dla 1on1) LUB receiver_group_id (dla grupy).');
    }
    return true;
  })
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

// GET / DELETE  ID
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