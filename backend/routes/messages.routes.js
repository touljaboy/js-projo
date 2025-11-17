// -----------------------------
// MESSAGE ROUTER
// -----------------------------

const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messages.controller');

router.get('/', messagesController.getMessages);
router.get('/:id', messagesController.getMessageById);
router.post('/', messagesController.createMessage);
router.patch('/:id', messagesController.patchMessage);
router.delete('/:id', messagesController.deleteMessage);

module.exports = router;