const db = require('../db');


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
  let rows = db.prepare(`
    SELECT id, user_a_id, user_b_id, last_message_at
    FROM conversations
    ORDER BY id
  `).all();

  // zachowujemy dokładnie zachowanie z mocka: filtr po A, potem po B, i 404 jeśli pusto
  if (user_a_id) {
    rows = rows.filter(c => c.user_a_id === parseInt(user_a_id));
    if (rows.length === 0) {
      throw { status: 404, message: `Nie znaleziono konwersacji dla user_a_id=${user_a_id}` };
    }
  }

  if (user_b_id) {
    rows = rows.filter(c => c.user_b_id === parseInt(user_b_id));
    if (rows.length === 0) {
      throw { status: 404, message: `Nie znaleziono konwersacji dla user_b_id=${user_b_id}` };
    }
  }

  return rows;
};


// --- GET ONE ---
exports.getOne = (id) => {
  return db.prepare(`
    SELECT id, user_a_id, user_b_id, last_message_at
    FROM conversations
    WHERE id = ?
  `).get(id) || null;
};


// --- CREATE ---
exports.create = (user_a_id, user_b_id) => {
  if (!user_a_id || !user_b_id) {
    throw { status: 400, message: "Brak wymaganych pól: user_a_id, user_b_id." };
  }

  const a = Number(user_a_id);
  const b = Number(user_b_id);

  const exists = db.prepare(`
    SELECT id FROM conversations
    WHERE (user_a_id = ? AND user_b_id = ?) OR (user_a_id = ? AND user_b_id = ?)
  `).get(a, b, b, a);

  if (exists) {
    throw { status: 409, message: `Konwersacja między ${a} i ${b} już istnieje.` };
  }

  try {
    const info = db.prepare(`
      INSERT INTO conversations (user_a_id, user_b_id, last_message_at)
      VALUES (?, ?, NULL)
    `).run(a, b);

    return exports.getOne(Number(info.lastInsertRowid));
  } catch (e) {
    if (String(e.message).includes('FOREIGN KEY')) {
      throw { status: 400, message: 'Nieprawidłowy user_a_id albo user_b_id.' };
    }
    throw e;
  }
};


// --- UPDATE ---
exports.update = (id, last_message_at) => {
  const conv = exports.getOne(parseInt(id));
  if (!conv) {
    throw { status: 404, message: `Konwersacja o ID ${id} nie istnieje.` };
  }
  if (!last_message_at) {
    throw { status: 400, message: "Brak last_message_at w PATCH." };
  }

  const iso = new Date(last_message_at).toISOString();

  db.prepare(`
    UPDATE conversations SET last_message_at = ? WHERE id = ?
  `).run(iso, parseInt(id));

  return exports.getOne(parseInt(id));
};


// --- DELETE ---
exports.remove = (id) => {
  const info = db.prepare(`DELETE FROM conversations WHERE id = ?`).run(parseInt(id));
  if (info.changes === 0) {
    throw { status: 404, message: `Konwersacja o ID ${id} nie istnieje.` };
  }
};

// -----------------------------------------
// PUT (FULL REPLACE)
// -----------------------------------------
exports.replace = (id, data) => {
  const conv = exports.getOne(parseInt(id));
  if (!conv) return null;

  const { user_a_id, user_b_id, last_message_at } = data;

  if (!user_a_id || !user_b_id) {
    throw { status: 400, message: "PUT wymaga pól: user_a_id, user_b_id." };
  }

  const a = Number(user_a_id);
  const b = Number(user_b_id);

  const duplicate = db.prepare(`
    SELECT id FROM conversations
    WHERE (
      (user_a_id = ? AND user_b_id = ?) OR
      (user_a_id = ? AND user_b_id = ?)
    ) AND id <> ?
  `).get(a, b, b, a, parseInt(id));

  if (duplicate) {
    throw { status: 409, message: `Konwersacja między ${a} i ${b} już istnieje.` };
  }

  const iso = last_message_at ? new Date(last_message_at).toISOString() : null;

  try {
    db.prepare(`
      UPDATE conversations
      SET user_a_id = ?, user_b_id = ?, last_message_at = ?
      WHERE id = ?
    `).run(a, b, iso, parseInt(id));
  } catch (e) {
    if (String(e.message).includes('FOREIGN KEY')) {
      throw { status: 400, message: 'Nieprawidłowy user_a_id albo user_b_id.' };
    }
    throw e;
  }

  return exports.getOne(parseInt(id));
};
