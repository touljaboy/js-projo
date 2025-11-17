// -----------------------------
// MESSAGE SERVICE (MOCK DB)
// -----------------------------

let messages = [
    // 1 on 1 conv
    {
        message_id: 301,
        conversation_id: 201, // FK 
        sender_id: 1, // FK 
        receiver_group_id: null,
        message_content: 'Cześć Ewa, jak się masz?',
        sent_at: new Date('2025-05-10T07:59:00Z').toISOString()
    },
    // group conv
    {
        message_id: 302,
        conversation_id: null,
        sender_id: 2, // FK 
        receiver_group_id: 101, // FK do Group
        message_content: 'Witajcie wszyscy w grupie publicznej!',
        sent_at: new Date('2025-05-10T08:05:00Z').toISOString()
    },
    // another 1 on 1
    {
        message_id: 303,
        conversation_id: 201,
        sender_id: 2,
        receiver_group_id: null,
        message_content: 'Dobrze, dzięki! A Ty?',
        sent_at: new Date('2025-05-10T08:00:00Z').toISOString()
    }
];

let nextMessageId = 304;

// -----------------------------------------
// GET ALL
// -----------------------------------------
exports.getAll = () => {
    return messages;
};

// -----------------------------------------
// GET ONE BY ID
// -----------------------------------------
exports.getOne = (id) => {
    const message = messages.find(m => m.message_id === id);

    if (!message) {
        throw { status: 404, message: `Wiadomość o ID ${id} nie została znaleziona.` };
    }

    return message;
};

// -----------------------------------------
// CREATE MESSAGE
// -----------------------------------------
exports.create = ({ conversation_id, sender_id, receiver_group_id, message_content }) => {

    if (!sender_id || !message_content) {
        throw { status: 400, message: "Brak wymaganych pól: sender_id and message_content" };
    }

    const newMessage = {
        message_id: nextMessageId++,
        conversation_id: conversation_id || null, 
        sender_id: sender_id, 
        receiver_group_id: receiver_group_id || null,
        message_content: message_content,
        sent_at: new Date().toISOString(), // Server-side timestamp
    };

    messages.push(newMessage);
    return newMessage;
};

// -----------------------------------------
// PATCH (PARTIAL UPDATE)
// -----------------------------------------
exports.update = (id, { message_content }) => {
    const messageIdx = messages.findIndex(m => m.message_id === id);

    if (messageIdx === -1) {
        throw { status: 404, message: `Wiadomość o ID ${id} nie została znaleziona.` };
    }

    let messageToUpdate = messages[messageIdx];

    if (!message_content) {
        throw { status: 400, message: 'Brak tresci wiadomosci do aktualizacji.' };
    }

    // Update content and optionally update the 'sent_at' timestamp (as a mark of edit)
    messageToUpdate.message_content = message_content;
    messageToUpdate.sent_at = new Date().toISOString(); 
    
    messages[messageIdx] = messageToUpdate;
    
    return messageToUpdate;
};


// -----------------------------------------
// DELETE MESSAGE
// -----------------------------------------
exports.remove = (id) => {
    const index = messages.findIndex(m => m.message_id === id);

    if (index === -1) {
        throw { status: 404, message: `Wiadomość o ID ${id} nie została znaleziona.` };
    }
    
    const [deleted] = messages.splice(index, 1);

    return deleted;
};