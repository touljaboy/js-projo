

const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users.controller');
const { requireAuth, requireAdmin } = require('../middleware/auth.middleware');

// Publiczne endpointy (bez autoryzacji)
// POST /users jest używany przez rejestrację, więc pozostaje publiczny
router.post('/', usersController.create);

// Chronione endpointy (wymagają autoryzacji)
router.get('/', requireAuth, usersController.getAll);
router.get('/:id', requireAuth, usersController.getOne);
router.patch('/:id', requireAuth, usersController.patch);
router.delete('/:id', requireAuth, requireAdmin, usersController.delete);

module.exports = router;