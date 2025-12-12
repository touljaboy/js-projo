// -----------------------------
// AUTH ROUTES
// -----------------------------

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /v1/auth/register
router.post('/register', authController.register);

// POST /v1/auth/login
router.post('/login', authController.login);

// POST /v1/auth/logout
router.post('/logout', authController.logout);

// GET /v1/auth/me
router.get('/me', authController.me);

module.exports = router;
