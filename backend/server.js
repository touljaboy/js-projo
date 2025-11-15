
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

app.get('/v1/users', (req, res) => {
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

app.post('/v1/users', (req, res) => {
  const { user, password_hash } = req.body;

  if (!user || !password_hash) {
    return res.status(400).json({ error: "Brak wymaganych pól: user, password_hash" });
  }

  nextUserId++;

  const newUser = {
    id: nextUserId,
    user,
    password_hash,
    created_at: new Date(),
  };

  users.push(newUser);

  res.status(201).json(newUser);
});

app.delete('/v1/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === userId);

  if (index === -1) {
    return res.status(404).json({ error: `Użytkownik o ID ${userId} nie został znaleziony.` });
  }

  const deleted = users.splice(index, 1)[0];

  res.status(200).json({ message: "Użytkownik usunięty.", deleted });
});

app.patch('/v1/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: `Użytkownik o ID ${userId} nie został znaleziony.` });
  }

  const { user: newUserName, password_hash: newPass } = req.body;

  if (newUserName !== undefined) user.user = newUserName;
  if (newPass !== undefined) user.password_hash = newPass;

  res.status(200).json(user);
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
      error: 'Brak danych do aktualizacji. Przekaż np. last_message_at.'
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

/**
 * GET
 * 
 * Filters the list of user-group relations by the given user ID.
 * Returns only those records that belong to the specified user.
 * Throws an error if no matching relations are found.
 */
function filterByUserId(result, userId) {
  result = result.filter(userGroup => userGroup.user_id === parseInt(userId));

  if (result.length === 0) {
    throw {
      status: 404,
      message: `Nie znaleziono żadnych grup dla użytkownika o ID ${userId}.`
    };
  }

  return result;
}

/**
 * GET
 * 
 * Filters the list of user-group relations by the given group ID.
 * Returns only those records that belong to the specified group.
 * Throws an error if no matching users are found in that group.
 *
 */
function filterByGroupId(result, groupId) {
  result = result.filter(userGroup => userGroup.group_id === parseInt(groupId));

  if (result.length === 0) {
    throw {
      status: 404,
      message: `Nie znaleziono żadnych użytkowników w grupie o ID ${groupId}.`
    };
  }

  return result;
}

/**
 * GET
 *
 * Retrieves user-group relations, optionally filtered by user ID and/or group ID.
 * If no query parameters are provided, all user-group relations are returned.
 * If no matching records are found for a given filter, an error is thrown by the helper functions.
 * 
 */
app.get('/v1/usergroups', (req, res) => {
  const { userId, groupId } = req.query;

  let result = userGroups;

  if (userId) {
    result = filterByUserId(result, userId);
  }

  if (groupId) {
    result = filterByGroupId(result, groupId);
  }

  res.status(200).json(result);
})

/**
 * POST
 * 
 * Validates that required fields (user_id, group_id) are present in the request body.
 * Throws an error with status 400 if any field is missing.
 *
 */
function validateUserGroupFields(user_id, group_id) {
  if (!user_id || !group_id) {
    throw {
      status: 400,
      message: 'Brak wymaganych pól: user_id lub group_id.'
    };
  }
}

/**
 * POST
 * 
 * Checks if a user-group relation already exists.
 * Throws an error with status 409 if the relation is found.
 * 
 */
function checkExistingRelation(userGroups, user_id, group_id) {
  const existingRelation = userGroups.find(
    userGroup => userGroup.user_id === user_id && userGroup.group_id === group_id
  );

  if (existingRelation) {
    throw {
      status: 409,
      message: `Użytkownik o ID ${user_id} jest już członkiem grupy o ID ${group_id}.`
    };
  }
}

/**
 * POST
 * 
 * Creates a new user-group relation object.
 * 
 */
function createUserGroup(user_id, group_id) {
  return {
    user_id,
    group_id,
    joined_at: new Date()
  };
}

// -----------------------------
// POST /v1/usergroups
// -----------------------------
app.post('/v1/usergroups', (req, res) => {
  const { user_id, group_id } = req.body;

  try {
    validateUserGroupFields(user_id, group_id);

    checkExistingRelation(userGroups, user_id, group_id);

    const newUserGroup = createUserGroup(user_id, group_id);
    userGroups.push(newUserGroup);

    res.status(201).json(newUserGroup);
  } catch (error) {
    console.log(error);
  }
});


/**
 * PATCH
 * 
 * Validates that required fields are present in the request body.
 * Sends a 400 response if any required field is missing.
 */
function validateUpdateFields(user_id, group_id, res) {
  if (!user_id || !group_id) {
    res.status(400).json({ error: 'Brak wymaganych pól: user_id lub group_id.' });
    return false;
  }
  return true;
}

/**
 * PATCH
 * 
 * Finds the index of the user-group relation based on user_id and group_id.
 * Sends a 404 response if no such relation is found.
 */
function findUserGroupIndex(userGroups, user_id, group_id, res) {
  const index = userGroups.findIndex(
    userGroup => userGroup.user_id === user_id && userGroup.group_id === group_id
  );

  if (index === -1) {
    res.status(404).json({
      error: `Nie znaleziono relacji user_id=${user_id}, group_id=${group_id}.`
    });
    return -1;
  }

  return index;
}

/**
 * PATCH
 * 
 * Updates the group relation and refreshes the join date.
 */
function updateUserGroup(userGroups, index, new_group_id) {
  if (new_group_id) {
    userGroups[index].group_id = new_group_id;
  }
  userGroups[index].joined_at = new Date();
  return userGroups[index];
}

/**
 * PATCH
 * 
 * Checks if the user is already a member of the target group before updating.
 * Sends a 409 response if such a relation already exists.
 */
function checkDuplicateRelation(userGroups, user_id, new_group_id, res) {
  const duplicate = userGroups.find(
    userGroup => userGroup.user_id === user_id && userGroup.group_id === new_group_id
  );

  if (duplicate) {
    res.status(409).json({
      error: `Użytkownik o ID ${user_id} jest już członkiem grupy o ID ${new_group_id}.`
    });
    return true;
  }

  return false;
}

// -----------------------------
// PATCH /v1/usergroups
// -----------------------------
app.patch('/v1/usergroups', (req, res) => {
  const { user_id, group_id, new_group_id } = req.body;

  if (!validateUpdateFields(user_id, group_id, res)) return;

  const index = findUserGroupIndex(userGroups, user_id, group_id, res);
  if (index === -1) return;

  if (new_group_id && checkDuplicateRelation(userGroups, user_id, new_group_id, res)) return;

  const updated = updateUserGroup(userGroups, index, new_group_id);

  res.status(200).json({
    message: 'Zaktualizowano relację użytkownika w grupie.',
    updated
  });
});

/**
 * DELETE
 * 
 * Validates that both user_id and group_id are present in the request body.
 * Sends a 400 response if any required field is missing.
 *
 */
function validateDeleteFields(user_id, group_id, res) {
  if (!user_id || !group_id) {
    res.status(400).json({
      error: 'Brak wymaganych pól: user_id lub group_id.'
    });
    return false;
  }
  return true;
}

/**
 * DELETE
 * 
 * Removes a user-group relation if it exists.
 * Sends a 404 response if the relation was not found.
 *
 */
function removeUserGroup(userGroups, user_id, group_id, res) {
  const initialLength = userGroups.length;

  const updatedList = userGroups.filter(
    userGroup => !(userGroup.user_id === user_id && userGroup.group_id === group_id)
  );

  if (updatedList.length === initialLength) {
    res.status(404).json({
      error: `Nie znaleziono relacji user_id=${user_id}, group_id=${group_id}.`
    });
    return null;
  }

  return updatedList;
}

// -----------------------------
// DELETE /v1/usergroups
// -----------------------------
app.delete('/v1/usergroups', (req, res) => {
  const { user_id, group_id } = req.body;

  if (!validateDeleteFields(user_id, group_id, res)) return;

  const updatedList = removeUserGroup(userGroups, user_id, group_id, res);
  if (!updatedList) return;

  userGroups = updatedList;

  res.status(204).send();
});
