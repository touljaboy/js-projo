const db = require('../db');

// -----------------------------------------
// GET ALL
// -----------------------------------------
exports.getAll = () => {
  return db.prepare(`
    SELECT message_id, conversation_id, sender_id, receiver_group_id, message_content, sent_at
    FROM messages
    ORDER BY message_id
  `).all();
};

// -----------------------------------------
// GET ONE BY ID
// -----------------------------------------
exports.getOne = (id) => {
  const row = db.prepare(`
    SELECT message_id, conversation_id, sender_id, receiver_group_id, message_content, sent_at
    FROM messages
    WHERE message_id = ?
  `).get(id);

  if (!row) {
    throw { status: 404, message: `Wiadomość o ID ${id} nie została znaleziona.` };
  }
  return row;
};

// -----------------------------------------
// CREATE MESSAGE
// -----------------------------------------
exports.create = ({ conversation_id, sender_id, receiver_group_id, message_content }) => {
  if (!sender_id || !message_content) {
    throw { status: 400, message: "Brak wymaganych pól: sender_id and message_content" };
  }

  try {
    const info = db.prepare(`
      INSERT INTO messages (conversation_id, sender_id, receiver_group_id, message_content, sent_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      conversation_id || null,
      sender_id,
      receiver_group_id || null,
      message_content,
      new Date().toISOString()
    );

    return exports.getOne(Number(info.lastInsertRowid));
  } catch (e) {
    if (String(e.message).includes('FOREIGN KEY')) {
      throw { status: 400, message: 'Nieprawidłowy sender_id / conversation_id / receiver_group_id.' };
    }
    throw e;
  }
};

// -----------------------------------------
// PATCH (PARTIAL UPDATE)
// -----------------------------------------
exports.update = (id, { message_content }) => {
  // sprawdź istnienie
  exports.getOne(id);

  if (!message_content) {
    throw { status: 400, message: 'Brak tresci wiadomosci do aktualizacji.' };
  }

  db.prepare(`
    UPDATE messages
    SET message_content = ?, sent_at = ?
    WHERE message_id = ?
  `).run(message_content, new Date().toISOString(), id);

  return exports.getOne(id);
};


// -----------------------------------------
// DELETE MESSAGE
// -----------------------------------------
exports.remove = (id) => {
  const current = exports.getOne(id);
  db.prepare(`DELETE FROM messages WHERE message_id = ?`).run(id);
  return current;
};