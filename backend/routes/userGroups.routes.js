const express = require('express');
const router = express.Router();

const userGroupsController = require('../controllers/userGroups.controller');

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

router.get('/', getAllValidation, validate, userGroupsController.getAll);
router.get('/:id', idParamValidation, validate, userGroupsController.getOne);
router.post('/', createUserGroupValidation, validate, userGroupsController.create);
router.patch('/:id', updateUserGroupValidation, validate, userGroupsController.update);
router.delete('/:id', idParamValidation, validate, userGroupsController.remove);
router.put('/:id', createUserGroupValidation, validate, userGroupsController.replace);


module.exports = router;
