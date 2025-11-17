const express = require('express');
const router = express.Router();

const userGroupsController = require('../controllers/userGroups.controller');

router.get('/', userGroupsController.getAll);
router.get('/:id', userGroupsController.getOne);
router.post('/', userGroupsController.create);
router.patch('/:id', userGroupsController.update);
router.delete('/:id', userGroupsController.remove);
router.put('/:id', userGroupsController.replace);


module.exports = router;
