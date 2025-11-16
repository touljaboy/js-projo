// -----------------------------
// CONVERSATIONS SERVICE
// -----------------------------

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
    last_message_at: null
  }
];

let nextConversationId = 203;


// --- FILTER HELPERS ---

function filterByUserA(list, userAId) {
  const result = list.filter(conv => conv.user_a_id === parseInt(userAId));

  if (result.length === 0) {
    throw { status: 404, message: `Nie znaleziono konwersacji dla user_a_id=${userAId}` };
  }

  return result;
}

function filterByUserB(list, userBId) {
  const result = list.filter(conv => conv.user_b_id === parseInt(userBId));

  if (result.length === 0) {
    throw { status: 404, message: `Nie znaleziono konwersacji dla user_b_id=${userBId}` };
  }

  return result;
}


// --- GET ALL ---
exports.getAll = (user_a_id, user_b_id) => {
  let result = [...conversations];

  if (user_a_id) result = filterByUserA(result, user_a_id);
  if (user_b_id) result = filterByUserB(result, user_b_id);

  return result;
};


// --- GET ONE ---
exports.getOne = (id) => {
  return conversations.find(c => c.id === id);
};


// --- CREATE ---
exports.create = (user_a_id, user_b_id) => {
  if (!user_a_id || !user_b_id) {
    throw { status: 400, message: "Brak wymaganych pól: user_a_id, user_b_id." };
  }

  const exists = conversations.find(conv =>
    (conv.user_a_id === user_a_id && conv.user_b_id === user_b_id) ||
    (conv.user_a_id === user_b_id && conv.user_b_id === user_a_id)
  );

  if (exists) {
    throw { status: 409, message: `Konwersacja między ${user_a_id} i ${user_b_id} już istnieje.` };
  }

  const newConv = {
    id: nextConversationId++,
    user_a_id,
    user_b_id,
    last_message_at: null
  };

  conversations.push(newConv);
  return newConv;
};


// --- UPDATE ---
exports.update = (id, last_message_at) => {
  const index = conversations.findIndex(c => c.id === parseInt(id));

  if (index === -1) {
    throw { status: 404, message: `Konwersacja o ID ${id} nie istnieje.` };
  }

  if (!last_message_at) {
    throw { status: 400, message: "Brak last_message_at w PATCH." };
  }

  conversations[index].last_message_at = new Date(last_message_at);

  return conversations[index];
};


// --- DELETE ---
exports.remove = (id) => {
  const initialLength = conversations.length;

  conversations = conversations.filter(c => c.id !== parseInt(id));

  if (conversations.length === initialLength) {
    throw { status: 404, message: `Konwersacja o ID ${id} nie istnieje.` };
  }
};

// -----------------------------------------
// PUT (FULL REPLACE)
// -----------------------------------------
exports.replace = (id, data) => {
  const index = conversations.findIndex(c => c.id === parseInt(id));

  if (index === -1) {
    return null;
  }

  const { user_a_id, user_b_id, last_message_at } = data;

  if (!user_a_id || !user_b_id) {
    throw { status: 400, message: "PUT wymaga pól: user_a_id, user_b_id." };
  }

  // sprawdź duplikat
  const duplicate = conversations.find(
    conv =>
      (
        (conv.user_a_id === user_a_id && conv.user_b_id === user_b_id) ||
        (conv.user_a_id === user_b_id && conv.user_b_id === user_a_id)
      ) &&
      conv.id !== parseInt(id)
  );

  if (duplicate) {
    throw {
      status: 409,
      message: `Konwersacja między ${user_a_id} i ${user_b_id} już istnieje.`
    };
  }

  const newConv = {
    id: parseInt(id),
    user_a_id,
    user_b_id,
    last_message_at: last_message_at ? new Date(last_message_at) : null
  };

  conversations[index] = newConv;

  return newConv;
};
