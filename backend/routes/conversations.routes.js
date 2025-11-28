const express = require('express');
const router = express.Router();
const convController = require('../controllers/conversations.controller');

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

router.get('/', getAllValidation, validate, convController.getAll);
router.get('/:id', idParamValidation, validate, convController.getOne);
router.post('/', createConversationValidation, validate, convController.create);
router.patch('/:id', patchConversationValidation, validate, convController.update);
router.delete('/:id', idParamValidation, validate, convController.remove);
router.put('/:id', replaceConversationValidation, validate, convController.replace);


module.exports = router;