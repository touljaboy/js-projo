

const messagesService = require('../services/messages.service');

// Generic error handler to standardize responses
const handleError = (res, error) => {
    console.error('Controller Error:', error);
    // Use the status from the service error, or default to 500
    res.status(error.status || 500).json({ error: error.message || "Wystąpił nieznany błąd serwera." });
};

// GET /v1/messages
exports.getMessages = (req, res) => {
    try {
        // Pobierz parametry query
        const { limit, offset, conversation_id, receiver_group_id, orderBy, before_id } = req.query;
        
        const result = messagesService.getAll({
            limit,
            offset,
            conversation_id,
            receiver_group_id,
            orderBy,
            before_id
        });
        
        res.status(200).json(result);
    } catch (error) {
        handleError(res, error);
    }
};

// GET /v1/messages/:id
exports.getMessageById = (req, res) => {
    const messageId = parseInt(req.params.id);
    try {
        const message = messagesService.getOne(messageId);
        res.status(200).json(message);
    } catch (error) {
        handleError(res, error); 
    }
};

// POST /v1/messages
exports.createMessage = (req, res) => {
    // Pass the entire body to the service for validation and creation
    try {
        const newMessage = messagesService.create(req.body);
        res.status(201).json(newMessage); // 201 Created
    } catch (error) {
        handleError(res, error); 
    }
};

// PATCH /v1/messages/:id
exports.patchMessage = (req, res) => {
    const messageId = parseInt(req.params.id);
    const { message_content } = req.body;

    try {
        // Service handles finding the message and validation
        const updatedMessage = messagesService.update(messageId, { message_content });
        res.status(200).json(updatedMessage);
    } catch (error) {
        handleError(res, error); 
    }
};

// DELETE /v1/messages/:id
exports.deleteMessage = (req, res) => {
    const messageId = parseInt(req.params.id);
    try {
        const deletedMessage = messagesService.remove(messageId);
        res.status(200).json({ message: "Wiadomość usunięta", deleted: deletedMessage });
    } catch (error) {
        handleError(res, error); 
    }
};