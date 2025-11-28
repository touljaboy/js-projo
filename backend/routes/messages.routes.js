// -----------------------------
// MESSAGE ROUTER
// -----------------------------

const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messages.controller');

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

router.get('/', messagesController.getMessages);
router.get('/:id', idParamValidation, validate, messagesController.getMessageById);
router.post('/', createMessageValidation, validate, messagesController.createMessage);
router.patch('/:id', patchMessageValidation, validate, messagesController.patchMessage);
router.delete('/:id', idParamValidation, validate, messagesController.deleteMessage);

module.exports = router;