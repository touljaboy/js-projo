const db = require('../db');




exports.getAll = (options = {}) => {
    const { limit = 100, offset = 0 } = options;
    
    // Walidacja 
    const safeLimit = Math.min(Math.max(1, parseInt(limit) || 100), 100);
    const safeOffset = Math.max(0, parseInt(offset) || 0);
    
    return db.prepare(
        'SELECT id, user, password_hash, role, created_at FROM users ORDER BY id LIMIT ? OFFSET ?'
    ).all(safeLimit, safeOffset);
};


exports.getOne = (id) => {
    const row = db.prepare(
        'SELECT id, user, password_hash, role, created_at FROM users WHERE id = ?'
    ).get(id);

    if (!row) {
        throw { status: 404, message: `Użytkownik o ID ${id} nie został znaleziony.` };
    }
    return row;
};


exports.create = (user, password_hash, role = 'user') => {
    if (!user || !password_hash) {
        throw { status: 400, message: "Brak wymaganych pól: user, password_hash" };
    }

    try {
        const info = db.prepare(
            "INSERT INTO users (user, password_hash, role, created_at) VALUES (?, ?, ?, datetime('now'))"
        ).run(user, password_hash, role || 'user');

        return exports.getOne(Number(info.lastInsertRowid));
    } catch (e) {
        // np. UNIQUE constraint failed: users.user
        if (String(e.message).includes('UNIQUE')) {
            throw { status: 409, message: 'Taki użytkownik już istnieje.' };
        }
        throw e;
    }
};



exports.update = (id, newUserName, newPass, newRole) => {
    const current = exports.getOne(id);

    const nextUser = (newUserName !== undefined) ? newUserName : current.user;
    const nextPass = (newPass !== undefined) ? newPass : current.password_hash;
    const nextRole = (newRole !== undefined) ? newRole : current.role;

    try {
        db.prepare(
            'UPDATE users SET user = ?, password_hash = ?, role = ? WHERE id = ?'
        ).run(nextUser, nextPass, nextRole, id);

        return exports.getOne(id);
    } catch (e) {
        if (String(e.message).includes('UNIQUE')) {
            throw { status: 409, message: 'Taki użytkownik już istnieje.' };
        }
        throw e;
    }
};


exports.remove = (id) => {
  const current = exports.getOne(id); 

  db.prepare('DELETE FROM users WHERE id = ?').run(id);
  return current;
};