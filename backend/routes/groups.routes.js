// -----------------------------
// GROUP ROUTER
// -----------------------------

const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groups.controller');

router.get('/', groupsController.getGroups);
router.get('/:id', groupsController.getGroupById);
router.post('/', groupsController.createGroup);
router.put('/:id', groupsController.replaceGroup);
router.delete('/:id', groupsController.deleteGroup);

module.exports = router;