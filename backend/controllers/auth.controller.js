

const authService = require('../services/auth.service');

const handleError = (res, error) => {
    console.error('Auth Controller Error:', error);
    res.status(error.status || 500).json({ error: error.message || "Wystąpił nieznany błąd serwera." });
};

// POST /v1/auth/register
exports.register = (req, res) => {
    const { username, password, email, pesel } = req.body;
    try {
        const user = authService.register(username, password, email, pesel);
        res.status(201).json(user);
    } catch (error) {
        handleError(res, error);
    }
};

// POST /v1/auth/login
exports.login = (req, res) => {
    const { username, password } = req.body;
    try {
        const result = authService.login(username, password);
        res.status(200).json(result);
    } catch (error) {
        handleError(res, error);
    }
};

// POST /v1/auth/logout
exports.logout = (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    try {
        const result = authService.logout(token);
        res.status(200).json(result);
    } catch (error) {
        handleError(res, error);
    }
};

// GET /v1/auth/me
exports.me = (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    try {
        const session = authService.validateSession(token);
        res.status(200).json(session);
    } catch (error) {
        handleError(res, error);
    }
};
