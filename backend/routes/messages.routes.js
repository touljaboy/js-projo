

const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messages.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const { validationResult } = require('express-validator');
const {
  createMessageValidation,
  patchMessageValidation,
  idParamValidation
} = require('../validators/messagesValidator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Wszystkie endpointy wiadomości wymagają autoryzacji
router.get('/', requireAuth, messagesController.getMessages);
router.get('/:id', requireAuth, idParamValidation, validate, messagesController.getMessageById);
router.post('/', requireAuth, createMessageValidation, validate, messagesController.createMessage);
router.patch('/:id', requireAuth, patchMessageValidation, validate, messagesController.patchMessage);
router.delete('/:id', requireAuth, idParamValidation, validate, messagesController.deleteMessage);

module.exports = router;