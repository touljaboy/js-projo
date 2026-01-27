const express = require('express');
const router = express.Router();

const userGroupsController = require('../controllers/userGroups.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const { validationResult } = require('express-validator');
const {
  createUserGroupValidation,
  updateUserGroupValidation,
  getAllValidation,
  idParamValidation
} = require('../validators/userGroupsValidator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Wszystkie endpointy userGroups wymagają autoryzacji
router.get('/', requireAuth, getAllValidation, validate, userGroupsController.getAll);
router.get('/:id', requireAuth, idParamValidation, validate, userGroupsController.getOne);
router.post('/', requireAuth, createUserGroupValidation, validate, userGroupsController.create);
router.patch('/:id', requireAuth, updateUserGroupValidation, validate, userGroupsController.update);
router.delete('/:id', requireAuth, idParamValidation, validate, userGroupsController.remove);
router.put('/:id', requireAuth, createUserGroupValidation, validate, userGroupsController.replace);


module.exports = router;
