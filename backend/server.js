
// ----------------------
// !SERVER!
// ----------------------

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const userGroupsRouter = require('./routes/userGroups.routes');
app.use('/v1/usergroups', userGroupsRouter);
const conversationsRouter = require('./routes/conversations.routes');
app.use('/v1/convs', conversationsRouter);
const usersRouter = require("./routes/users.routes");
app.use("/v1/users", usersRouter)


// Health endpoint
app.get('/v1/health', (req, res) => {
  res.send('Saul Goodman 8|');
});


// Run the server
app.listen(PORT, () => {
  console.log(`Port ${PORT}`);
  console.log(`Adress: http://localhost:${PORT}`);
});

// ------------------------------
// ;3 !GROUPS! ;3 - CGRZEGORZ
// ------------------------------

// mock groups
let groups = [
  {
    id: 101,
    name: "kotki",
    is_public: true,
    password: null, // public group
    created_at: new Date('2025-01-15T10:00:00Z')
  },
  {
    id: 102,
    name: "pieski",
    is_public: false,
    password: 'securehash', // private group
    created_at: new Date('2025-02-20T14:30:00Z')
  }
];

let nextGroupId = 103;

app.post('/v1/groups', (req, res) => {
  const { name, is_public, password } = req.body;

  if (!name || !is_public) {
    return res.status(400).json({ error: 'Brak wymaganych pól, np nazwy grupy lub informacji czy jest publiczna' });
  }
  if (is_public && password) {
    return res.status(400).json({ error: 'Nie można utworzyć publicznej grupy z haslem' });
  }
  else if (!is_public && !password) {
    return res.status(400).json({ error: 'Brak hasla do prywatnej grupy' });
  }

  const newGroup = {
    id: nextGroupId++,
    name,
    is_public,
    password,
    created_at: new Date()
  };

  groups.push(newGroup);

  res.status(201).json(newGroup);
});

//Pobieranie wszystkich grup
app.get('/v1/groups', (req, res) => {
  res.json(groups);
});

//Pobieranie grupy po ID
app.get('/v1/groups/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const group = groups.find(g => g.id === id);

  if (!group) {
    return res.status(404).json({ error: 'Grupa nie istnieje' });
  }

  res.json(group);
});
//Usuwanie grupy po ID
app.delete('/v1/groups/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = groups.findIndex(g => g.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Grupa nie istnieje' });
  }

  const deleted = groups.splice(index, 1);

  res.json({ message: 'Grupa usunięta', group: deleted[0] });
});


// Updejtowanie grupy
app.put('/v1/groups/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const group = groups.find(g => g.id === id);

  if (!group) {
    return res.status(404).json({ error: 'Grupa nie istnieje' });
  }

  const { name, is_public, password } = req.body;

  if (!name || is_public === undefined) {
    return res.status(400).json({ error: 'Brak wymaganych pól: name, is_public' });
  }

  if (is_public && password) {
    return res.status(400).json({ error: 'Publiczna grupa nie może mieć hasła' });
  }

  if (!is_public && !password) {
    return res.status(400).json({ error: 'Prywatna grupa musi mieć hasło' });
  }

  // Updating
  group.name = name;
  group.is_public = is_public;
  group.password = password;
  group.updated_at = new Date();

  res.json(group);
});



// ------------------------------
// ;3 !CONVERSATION! ;3 - KACPER
// ------------------------------

// mock groups
let conversations = [
  {
    id: 201,
    user_a_id: 1,
    user_b_id: 2,
    last_message_at: new Date('2025-05-10T08:00:00Z')
  },
  {
    id: 202,
    user_a_id: 1,
    user_b_id: 3,
    last_message_at: null // new conversation
  }
];

let nextConversationId = 203;

app.delete('/v1/convs/:id', (req, res) => {
  const convId = parseInt(req.params.id);

  // check current length of conversations
  const initialLength = conversations.length;

  // lambda filter, can also just delete the element, but Im flexing
  conversations = conversations.filter(c => c.id != convId);

  // nothing got deleted, error
  if (conversations.length === initialLength) {
    return res.status(404).json({ error: `Konwersacja o ID ${convId} nie została znaleziona.` });
  }

  res.status(204).send();
});

/**
 * Filters conversations by user A ID.
 * 
 */
function filterByUserA(conversations, userAId) {
  const result = conversations.filter(conv => conv.user_a_id === parseInt(userAId));
  if (result.length === 0) {
    throw {
      status: 404,
      message: `Nie znaleziono żadnych konwersacji dla użytkownika A o ID ${userAId}.`
    };
  }
  return result;
}

/**
 * Filters conversations by user B ID.
 * 
 */
function filterByUserB(conversations, userBId) {
  const result = conversations.filter(conv => conv.user_b_id === parseInt(userBId));
  if (result.length === 0) {
    throw {
      status: 404,
      message: `Nie znaleziono żadnych konwersacji dla użytkownika B o ID ${userBId}.`
    };
  }
  return result;
}

// -----------------------------
// GET /v1/convs
// -----------------------------
app.get('/v1/convs', (req, res) => {
  const { user_a_id, user_b_id } = req.query;
  let result = [...conversations];

  try {
    if (user_a_id) result = filterByUserA(result, user_a_id);
    if (user_b_id) result = filterByUserB(result, user_b_id);

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message
    });
  }
});


/**
 * Validates that required fields (user_a_id, user_b_id) are present in the request body.
 * Sends a 400 response if any field is missing.
 */
function validateConversationFields(user_a_id, user_b_id, res) {
  if (!user_a_id || !user_b_id) {
    res.status(400).json({
      error: 'Brak wymaganych pól: user_a_id lub user_b_id.'
    });
    return false;
  }
  return true;
}

/**
 * Checks if a conversation between given users already exists.
 * Sends a 409 response if found.
 */
function checkExistingConversation(conversations, user_a_id, user_b_id, res) {
  const existing = conversations.find(conv =>
    (conv.user_a_id === user_a_id && conv.user_b_id === user_b_id) ||
    (conv.user_a_id === user_b_id && conv.user_b_id === user_a_id)
  );

  if (existing) {
    res.status(409).json({
      error: `Konwersacja między użytkownikami ${user_a_id} i ${user_b_id} już istnieje.`
    });
    return false;
  }

  return true;
}

/**
 * Creates a new conversation object.
 * 
 */
function createConversation(user_a_id, user_b_id) {
  return {
    id: nextConversationId++,
    user_a_id,
    user_b_id,
    last_message_at: null
  };
}

// -----------------------------
// POST /v1/convs
// -----------------------------
app.post('/v1/convs', (req, res) => {
  const { user_a_id, user_b_id } = req.body;

  if (!validateConversationFields(user_a_id, user_b_id, res)) return;

  if (!checkExistingConversation(conversations, user_a_id, user_b_id, res)) return;

  const newConv = createConversation(user_a_id, user_b_id);
  conversations.push(newConv);

  res.status(201).json(newConv);
});

/**
 * Validates that the conversation ID exists.
 * Sends a 404 response if not found.
 *
 */
function findConversationIndex(conversations, convId, res) {
  const index = conversations.findIndex(conv => conv.id === parseInt(convId));
  if (index === -1) {
    res.status(404).json({ error: `Konwersacja o ID ${convId} nie została znaleziona.` });
    return null;
  }
  return index;
}

/**
 * Updates a conversation object with the provided data.
 *
 */
function updateConversation(conversations, index, data) {
  const conv = conversations[index];

  if (data.last_message_at) {
    conv.last_message_at = new Date(data.last_message_at);
  }

  conversations[index] = conv;
  return conv;
}

// -----------------------------
// PATCH /v1/convs/:id
// -----------------------------
app.patch('/v1/convs/:id', (req, res) => {
  const convId = req.params.id;
  const { last_message_at } = req.body;

  if (!last_message_at) {
    return res.status(400).json({
      error: 'Brak danych do aktualizacji. Przekaż last_message_at.'
    });
  }

  const index = findConversationIndex(conversations, convId, res);
  if (index === null) return;

  const updatedConv = updateConversation(conversations, index, { last_message_at });

  res.status(200).json({
    message: 'Zaktualizowano konwersację.',
    updated: updatedConv
  });
});

// TODO update

// ------------------------------
// ;3 !MESSAGE! ;3 - CGRZEGORZ
// ------------------------------

// mock messages
let messages = [
  // 1 on 1 conv
  {
    message_id: 301,
    conversation_id: 201, // FK 
    sender_id: 1, // FK 
    receiver_group_id: null,
    message_content: 'Cześć Ewa, jak się masz?',
    sent_at: new Date('2025-05-10T07:59:00Z')
  },
  // group conv
  {
    message_id: 302,
    conversation_id: null,
    sender_id: 2, // FK 
    receiver_group_id: 101, // FK do Group
    message_content: 'Witajcie wszyscy w grupie publicznej!',
    sent_at: new Date('2025-05-10T08:05:00Z')
  },
  // another 1 on 1
  {
    message_id: 303,
    conversation_id: 201,
    sender_id: 2,
    receiver_group_id: null,
    message_content: 'Dobrze, dzięki! A Ty?',
    sent_at: new Date('2025-05-10T08:00:00Z')
  }
];

let nextMessageId = 304;

app.patch('/v1/messages/:id', (req, res) => {
  const messageId = parseInt(req.params.id);
  // update entire message
  const { message_content } = req.body;

  // another way to find id in a list
  const messageIdx = messages.findIndex(m => m.message_id == messageId);

  if (messageIdx === -1) {
    return res.status(404).json({ error: `Wiadomość o ID ${messageId} nie została znaleziona.` });
  }

  let messageToUpdate = messages[messageIdx]

  if (!message_content) {
    return res.status(400).json({ error: 'Brak tresci wiadomosci' });
  }
  messageToUpdate.message_content = message_content;
  // we can optionally edit the sent date

  messages[messageIdx] = messageToUpdate;
  res.status(200).json(messageToUpdate);
});

// There is also app.put() which would receive an entire object (like in post) and it would replace every field


// Get all messages
app.get('/v1/messages', (req, res) => {
  res.json(messages);
});

//Get specific message by id
app.get('/v1/messages/:id', (req, res) => {
  const messageId = parseInt(req.params.id);
  const message = messages.find(m => m.message_id === messageId);

  if (!message) {
    return res.status(404).json({ error: `Wiadomość o ID ${messageId} nie została znaleziona.` });
  }

  res.json(message);
});

//Delete message by id
app.delete('/v1/messages/:id', (req, res) => {
  const messageId = parseInt(req.params.id);
  const index = messages.findIndex(m => m.message_id === messageId);

  if (index === -1) {
    return res.status(404).json({ error: `Wiadomość o ID ${messageId} nie została znaleziona.` });
  }

  const deleted = messages.splice(index, 1)[0];

  res.json({
    message: 'Wiadomość usunięta',
    deleted
  });
});

//Post message
app.post('/v1/messages', (req, res) => {
  const { conversation_id, sender_id, receiver_group_id, message_content } = req.body;

  if (!sender_id || !message_content) {
    return res.status(400).json({ error: "Missing required fields: sender_id and message_content" });
  }

  const newMessageId = nextMessageId++;

  const newMessage = {
    message_id: newMessageId,
    conversation_id: conversation_id || null, // Use null if conversation_id is missing
    sender_id: sender_id, 
    receiver_group_id: receiver_group_id || null, // Use null if receiver_group_id is missing
    message_content: message_content,
    sent_at: new Date().toISOString(), // Use server time for accurate creation timestamp
  };

  messages.push(newMessage);
  res.status(200).json({
    status: 'success',
    message: 'Messages received successfully!'
  });
});
