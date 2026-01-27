

const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groups.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const { validationResult } = require('express-validator');
const {
  createGroupValidation,
  replaceGroupValidation,
  idParamValidation
} = require('../validators/groupsValidator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Wszystkie endpointy grup wymagają autoryzacji
router.get('/', requireAuth, groupsController.getGroups);
router.get('/:id', requireAuth, idParamValidation, validate, groupsController.getGroupById);
router.post('/', requireAuth, createGroupValidation, validate, groupsController.createGroup);
router.post('/:id/verify', requireAuth, groupsController.verifyGroupPassword);
router.put('/:id', requireAuth, replaceGroupValidation, validate, groupsController.replaceGroup);
router.delete('/:id', requireAuth, idParamValidation, validate, groupsController.deleteGroup);

module.exports = router;