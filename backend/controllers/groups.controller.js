// -----------------------------
// GROUP CONTROLLER
// -----------------------------

const groupsService = require('../services/groups.service');

// Generic error handler to standardize responses
const handleError = (res, error) => {
    console.error('Controller Error:', error);
    // Use the status from the service error, or default to 500
    res.status(error.status || 500).json({ error: error.message || "Wystąpił nieznany błąd serwera." });
};

// GET /v1/groups
exports.getGroups = (req, res) => {
    try {
        const allGroups = groupsService.getAll();
        res.status(200).json(allGroups);
    } catch (error) {
        handleError(res, error);
    }
};

// GET /v1/groups/:id
exports.getGroupById = (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const group = groupsService.getOne(id);
        res.status(200).json(group);
    } catch (error) {
        handleError(res, error); // Handles 404 from service
    }
};

// POST /v1/groups
exports.createGroup = (req, res) => {
    const { name, is_public, password } = req.body;
    try {
        // Service handles validation, ID generation, and saving
        const newGroup = groupsService.create(name, is_public, password);
        res.status(201).json(newGroup); // 201 Created
    } catch (error) {
        handleError(res, error); // Handles 400 from service
    }
};

// PUT /v1/groups/:id (Full Replacement)
exports.replaceGroup = (req, res) => {
    const id = parseInt(req.params.id);
    const { name, is_public, password } = req.body;

    try {
        // Note: The replace function handles the required field check and logic validation.
        const updatedGroup = groupsService.replace(id, name, is_public, password);
        res.status(200).json(updatedGroup);
    } catch (error) {
        handleError(res, error); // Handles 400 or 404 from service
    }
};

// DELETE /v1/groups/:id
exports.deleteGroup = (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const deletedGroup = groupsService.remove(id);
        res.status(200).json({ message: "Grupa usunięta.", deleted: deletedGroup });
    } catch (error) {
        handleError(res, error); // Handles 404 from service
    }
};