// -----------------------------
// USER ROUTER
// -----------------------------

const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users.controller');

router.get('/', usersController.getAll);
router.get('/:id', usersController.getOne);
router.post('/', usersController.create);
router.patch('/:id', usersController.patch);
router.delete('/:id', usersController.delete);

module.exports = router;