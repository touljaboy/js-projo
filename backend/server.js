
// ----------------------
// !SERVER!
// ----------------------

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

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
// *O* !USERS! *O* - BRZEGORZ
// ------------------------------

// mock users definitions, until we dont have a proper db ofc
let users = [
  { id: 1, user: 'brian', password_hash: 'mockhash1', created_at: new Date() },
  { id: 2, user: 'joshua', password_hash: 'mockhash2', created_at: new Date() },
  { id: 3, user: 'mirabell', password_hash: 'mockhash3', created_at: new Date() },
];
let nextUserId = 3;

app.get('/v1/users', (req,res) => {
  // return all users
  res.status(200).json(users);
});

app.get('/v1/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  // not found
  if (!user) {
    return res.status(404).json({ error: `Użytkownik o ID ${userId} nie został znaleziony.` });
  }
  // found
  res.status(200).json(user);
});

// TODO post, delete, update

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
    return res.status(400).json({ error: 'Brak wymaganych pól, np nazwy grupy lub informacji czy jest publiczna'});
  }
  if (is_public && password) {
    return res.status(400).json({ error: 'Nie można utworzyć publicznej grupy z haslem'});
  }
  else if (!is_public && !password) {
    return res.status(400).json({ error: 'Brak hasla do prywatnej grupy'});
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

// TODO get, delete, update

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

// TODO get, post, update

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
  const {message_content} = req.body;

  // another way to find id in a list
  const messageIdx = messages.findIndex(m => m.message_id == messageId);

  if (messageIdx === -1) {
    return res.status(404).json({ error: `Wiadomość o ID ${messageId} nie została znaleziona.` });
  }

  let messageToUpdate = messages[messageIdx]

  if (!message_content) {
    return res.status(400).json({ error: 'Brak tresci wiadomosci'});
  }
  messageToUpdate.message_content = message_content;
  // we can optionally edit the sent date

  messages[messageIdx] = messageToUpdate;
  res.status(200).json(messageToUpdate);
});

// There is also app.put() which would receive an entire object (like in post) and it would replace every field

// TODO get, post, delete


// ---------------------
// USERGROUP - KACPER
// ---------------------

let userGroups = [
  // ID 1 jest członkiem grupy 101
  { user_id: 1, group_id: 101, joined_at: new Date('2025-03-01T10:00:00Z') },
  // ID 2 jest członkiem grupy 101
  { user_id: 2, group_id: 101, joined_at: new Date('2025-03-01T10:00:00Z') },
  // ID 1 jest członkiem grupy 102
  { user_id: 1, group_id: 102, joined_at: new Date('2025-03-05T11:00:00Z') }
];

// TODO get, post, update, delete
