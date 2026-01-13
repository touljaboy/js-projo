// -----------------------------
// GROUP SERVICE (MOCK DB)
// -----------------------------

const db = require('../db');

// -----------------------------------------
// GET ALL
// -----------------------------------------
exports.getAll = () => {
    return db.prepare(`
    SELECT id, name, is_public, password, creator_id, created_at
    FROM groups
    ORDER BY id
  `).all();
};

// -----------------------------------------
// GET ONE BY ID
// -----------------------------------------
exports.getOne = (id) => {
    const row = db.prepare(`
    SELECT id, name, is_public, password, creator_id, created_at
    FROM groups
    WHERE id = ?
  `).get(id);

    if (!row) {
        throw { status: 404, message: `Grupa o ID ${id} nie została znaleziona.` };
    }
    return row;
};

// -----------------------------------------
// CREATE GROUP
// -----------------------------------------
exports.create = ({ id, name, is_public = true, password = null, creator_id }) => {
    if (!name || creator_id == null) {
        throw { status: 400, message: "Brak wymaganych pól: name, creator_id" };
    }

    const isPublicInt = is_public ? 1 : 0;
    const pass = isPublicInt === 1 ? null : password;

    try {
        if (id != null) {
            db.prepare(`
        INSERT INTO groups (id, name, is_public, password, creator_id, created_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
      `).run(id, name, isPublicInt, pass, creator_id);
            return exports.getOne(id);
        }

        const info = db.prepare(`
      INSERT INTO groups (name, is_public, password, creator_id, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `).run(name, isPublicInt, pass, creator_id);

        return exports.getOne(Number(info.lastInsertRowid));
    } catch (e) {
        if (String(e.message).includes('UNIQUE')) {
            throw { status: 409, message: 'Taka grupa już istnieje.' };
        }
        if (String(e.message).includes('FOREIGN KEY')) {
            throw { status: 400, message: 'creator_id nie istnieje w users.' };
        }
        throw e;
    }
};



// -----------------------------------------
// PUT (FULL REPLACE)
// -----------------------------------------
exports.replace = (id, name, is_public, password) => {
    // 1) czy istnieje
    const current = exports.getOne(id);

    // 2) walidacje jak wcześniej
    if (!name || is_public === undefined) {
        throw { status: 400, message: 'Brak wymaganych pól: name, is_public' };
    }

    const isPublicInt = is_public ? 1 : 0;

    if (isPublicInt === 1 && password) {
        throw { status: 400, message: 'Publiczna grupa nie może mieć hasła' };
    }
    if (isPublicInt === 0 && !password) {
        throw { status: 400, message: 'Prywatna grupa musi mieć hasło' };
    }

    // 3) update
    try {
        db.prepare(`
      UPDATE groups
      SET name = ?, is_public = ?, password = ?
      WHERE id = ?
    `).run(name, isPublicInt, isPublicInt === 1 ? null : password, id);
    } catch (e) {
        if (String(e.message).includes('UNIQUE')) {
            throw { status: 409, message: 'Taka grupa już istnieje.' };
        }
        throw e;
    }

    // 4) zwrot (bez password, jak wcześniej)
    const updated = exports.getOne(id);
    const { password: _pw, ...safe } = updated;
    return safe;
};



// -----------------------------------------
// DELETE GROUP
// -----------------------------------------
exports.remove = (id) => {
    const current = exports.getOne(id);
    db.prepare('DELETE FROM groups WHERE id = ?').run(id);
    return current;
};

// -----------------------------------------
// VERIFY GROUP PASSWORD
// -----------------------------------------
exports.verifyPassword = (id, password) => {
    const group = exports.getOne(id);

    // is_public w DB to 1/0
    const isPublic = group.is_public === 1;

    if (isPublic) {
        return { valid: true, message: 'Grupa jest publiczna' };
    }

    if (!password) {
        throw { status: 400, message: 'Brak hasła' };
    }

    const isValid = group.password === password;

    if (!isValid) {
        throw { status: 401, message: 'Nieprawidłowe hasło' };
    }

    return { valid: true, message: 'Hasło prawidłowe' };
};
