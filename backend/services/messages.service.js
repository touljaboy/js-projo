const db = require('../db');

exports.getAll = (options = {}) => {
  const {
    limit = 50,          // Domyślnie max 50 najnowszych wiadomości
    offset = 0,          // Offset od końca (0 = najnowsze)
    conversation_id,     // Filtrowanie po konwersacji
    receiver_group_id,   // Filtrowanie po grupie
    before_id,           // Pobierz wiadomości starsze niż ten message_id 
  } = options;

  // Walidacja limitu 
  const safeLimit = Math.min(Math.max(1, parseInt(limit) || 50), 100);
  const safeOffset = Math.max(0, parseInt(offset) || 0);

  const conditions = [];
  const params = [];
  
  if (conversation_id) {
    conditions.push('conversation_id = ?');
    params.push(conversation_id);
  }
  if (receiver_group_id) {
    conditions.push('receiver_group_id = ?');
    params.push(receiver_group_id);
  }
  if (before_id) {
    conditions.push('message_id < ?');
    params.push(before_id);
  }

  const whereClause = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';

  // Pobierz ostatnie X wiadomości (subquery z DESC, potem odwróć do ASC)
  const query = `
    SELECT * FROM (
      SELECT message_id, conversation_id, sender_id, receiver_group_id, message_content, sent_at
      FROM messages
      ${whereClause}
      ORDER BY sent_at DESC, message_id DESC
      LIMIT ? OFFSET ?
    )
    ORDER BY sent_at ASC, message_id ASC
  `;

  params.push(safeLimit, safeOffset);
  const messages = db.prepare(query).all(...params);

  // Zwróć również metadata do paginacji
  return {
    messages,
    pagination: {
      limit: safeLimit,
      offset: safeOffset,
      count: messages.length,
      hasMore: messages.length === safeLimit,
      oldestMessageId: messages.length > 0 ? messages[0].message_id : null
    }
  };
};


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



exports.remove = (id) => {
  const current = exports.getOne(id);
  db.prepare(`DELETE FROM messages WHERE message_id = ?`).run(id);
  return current;
};