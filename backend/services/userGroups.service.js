const db = require('../db');

// -----------------------------------------
// GET ALL WITH OPTIONAL FILTERS
// -----------------------------------------
exports.getAll = () => {
    return db.prepare(`
    SELECT id, user_id, group_id, joined_at
    FROM user_groups
    ORDER BY id
  `).all();
};


// -----------------------------------------
// GET ONE BY ID
// -----------------------------------------
exports.getOne = (id) => {
    const row = db.prepare(`
    SELECT id, user_id, group_id, joined_at
    FROM user_groups
    WHERE id = ?
  `).get(id);

    if (!row) {
        throw { status: 404, message: `Relacja o ID ${id} nie została znaleziona.` };
    }
    return row;
};

// -----------------------------------------
// CREATE RELATION
// -----------------------------------------
exports.create = ({ user_id, group_id, joined_at }) => {
    if (user_id == null || group_id == null) {
        throw { status: 400, message: "Brak wymaganych pól: user_id, group_id" };
    }

    const joinedAt = joined_at || new Date().toISOString();

    try {
        const info = db.prepare(`
      INSERT INTO user_groups (user_id, group_id, joined_at)
      VALUES (?, ?, ?)
    `).run(user_id, group_id, joinedAt);

        return exports.getOne(Number(info.lastInsertRowid));
    } catch (e) {
        if (String(e.message).includes('UNIQUE')) {
            throw { status: 409, message: 'Ten użytkownik już jest w tej grupie.' };
        }
        if (String(e.message).includes('FOREIGN KEY')) {
            throw { status: 400, message: 'Nieprawidłowy user_id albo group_id.' };
        }
        throw e;
    }
};


// -----------------------------------------
// PATCH (PARTIAL UPDATE)
// -----------------------------------------
exports.update = (id, user_id, group_id) => {
    const current = exports.getOne(id);

    const nextUserId = (user_id !== undefined) ? user_id : current.user_id;
    const nextGroupId = (group_id !== undefined) ? group_id : current.group_id;

    // jeśli zmienia się para, sprawdź duplikat (UNIQUE(user_id, group_id))
    if (nextUserId !== current.user_id || nextGroupId !== current.group_id) {
        const duplicate = db.prepare(`
      SELECT id FROM user_groups
      WHERE user_id = ? AND group_id = ? AND id <> ?
    `).get(nextUserId, nextGroupId, id);

        if (duplicate) {
            throw {
                status: 409,
                message: `Użytkownik ${nextUserId} już należy do grupy ${nextGroupId}.`
            };
        }
    }

    try {
        db.prepare(`
      UPDATE user_groups
      SET user_id = ?, group_id = ?, joined_at = ?
      WHERE id = ?
    `).run(nextUserId, nextGroupId, new Date().toISOString(), id);

        return exports.getOne(id);
    } catch (e) {
        if (String(e.message).includes('FOREIGN KEY')) {
            throw { status: 400, message: 'Nieprawidłowy user_id albo group_id.' };
        }
        if (String(e.message).includes('UNIQUE')) {
            throw { status: 409, message: `Użytkownik ${nextUserId} już należy do grupy ${nextGroupId}.` };
        }
        throw e;
    }
};



// -----------------------------------------
// PUT (FULL REPLACE)
// -----------------------------------------
exports.replace = (id, data) => {
    const current = exports.getOne(Number(id));

    if (data.user_id == null || data.group_id == null) {
        throw { status: 400, message: 'Brak wymaganych pól: user_id, group_id' };
    }

    const nextUserId = data.user_id;
    const nextGroupId = data.group_id;

    // duplikat pary (z wykluczeniem tego id)
    const duplicate = db.prepare(`
    SELECT id FROM user_groups
    WHERE user_id = ? AND group_id = ? AND id <> ?
  `).get(nextUserId, nextGroupId, Number(id));

    if (duplicate) {
        throw {
            status: 409,
            message: `Użytkownik ${nextUserId} już należy do grupy ${nextGroupId}.`
        };
    }

    try {
        db.prepare(`
      UPDATE user_groups
      SET user_id = ?, group_id = ?, joined_at = ?
      WHERE id = ?
    `).run(nextUserId, nextGroupId, new Date().toISOString(), Number(id));

        return exports.getOne(Number(id));
    } catch (e) {
        if (String(e.message).includes('FOREIGN KEY')) {
            throw { status: 400, message: 'Nieprawidłowy user_id albo group_id.' };
        }
        if (String(e.message).includes('UNIQUE')) {
            throw { status: 409, message: `Użytkownik ${nextUserId} już należy do grupy ${nextGroupId}.` };
        }
        throw e;
    }
};


// -----------------------------------------
// DELETE RELATION
// -----------------------------------------
exports.remove = (id) => {
    const current = exports.getOne(id);
    db.prepare('DELETE FROM user_groups WHERE id = ?').run(id);
    return current;
};
