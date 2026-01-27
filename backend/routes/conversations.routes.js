const express = require('express');
const router = express.Router();
const convController = require('../controllers/conversations.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const { validationResult } = require('express-validator');
const {
  createConversationValidation,
  replaceConversationValidation,
  patchConversationValidation,
  getAllValidation,
  idParamValidation
} = require('../validators/conversationsValidator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Wszystkie endpointy konwersacji wymagają autoryzacji
router.get('/', requireAuth, getAllValidation, validate, convController.getAll);
router.get('/:id', requireAuth, idParamValidation, validate, convController.getOne);
router.post('/', requireAuth, createConversationValidation, validate, convController.create);
router.patch('/:id', requireAuth, patchConversationValidation, validate, convController.update);
router.delete('/:id', requireAuth, idParamValidation, validate, convController.remove);
router.put('/:id', requireAuth, replaceConversationValidation, validate, convController.replace);


module.exports = router;