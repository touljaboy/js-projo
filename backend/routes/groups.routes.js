// -----------------------------
// GROUP ROUTER
// -----------------------------

const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groups.controller');

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

router.get('/', groupsController.getGroups);
router.get('/:id', idParamValidation, validate, groupsController.getGroupById);
router.post('/', createGroupValidation, validate, groupsController.createGroup);
router.put('/:id', replaceGroupValidation, validate, groupsController.replaceGroup);
router.delete('/:id', idParamValidation, validate, groupsController.deleteGroup);

module.exports = router;