

const usersService = require('../services/users.service');

// Generic error handler to standardize responses
const handleError = (res, error) => {
    console.error('Controller Error:', error);
    // Use the status from the service error, or default to 500
    res.status(error.status || 500).json({ error: error.message || "Wystąpił nieznany błąd serwera." });
};

// GET /v1/users
exports.getAll = (req, res) => {
    try {
        const { limit, offset } = req.query;
        const allUsers = usersService.getAll({ limit, offset });
        res.status(200).json(allUsers);
    } catch (error) {
        handleError(res, error);
    }
};

// GET /v1/users/:id
exports.getOne = (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const user = usersService.getOne(userId);
        res.status(200).json(user);
    } catch (error) {
        handleError(res, error); 
    }
};

// POST /v1/users
exports.create = (req, res) => {
    const { user, password_hash, role } = req.body;
    try {
        // Service handles validation, ID generation, and saving
        const newUser = usersService.create(user, password_hash, role);
        res.status(201).json(newUser); // 201 Created
    } catch (error) {
        handleError(res, error); 
    }
};

// PATCH /v1/users/:id
exports.patch = (req, res) => {
    const userId = parseInt(req.params.id);
    const { user: newUserName, password_hash: newPass, role: newRole } = req.body;

    try {
        // Only update if at least one field is provided in the body
        if (newUserName === undefined && newPass === undefined && newRole === undefined) {
             return res.status(400).json({ error: "Brak danych do aktualizacji." });
        }
        
        const updatedUser = usersService.update(userId, newUserName, newPass, newRole);
        res.status(200).json(updatedUser);
    } catch (error) {
        handleError(res, error); 
    }
};

// DELETE /v1/users/:id
exports.delete = (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const deletedUser = usersService.remove(userId);
        res.status(200).json({ message: "Użytkownik usunięty.", deleted: deletedUser });
    } catch (error) {
        handleError(res, error); 
    }
};