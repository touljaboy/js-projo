const db = require('../db');

// -----------------------------
// USER SERVICE (MOCK DB)
// -----------------------------

/**
 * Retrieves all users.
 */
exports.getAll = () => {
    return db.prepare('SELECT id, user, password_hash, role, created_at FROM users ORDER BY id').all();
};

/**
 * Retrieves a single user by ID.
 * @param {number} id - The user ID.
 * @returns {object} The user object.
 * @throws {object} 404 error if user not found.
 */
exports.getOne = (id) => {
    const row = db.prepare(
        'SELECT id, user, password_hash, role, created_at FROM users WHERE id = ?'
    ).get(id);

    if (!row) {
        throw { status: 404, message: `Użytkownik o ID ${id} nie został znaleziony.` };
    }
    return row;
};

/**
 * Creates and saves a new user.
 * @param {string} user - The username.
 * @param {string} password_hash - The hashed password.
 * @param {string} role - The user role ('user' or 'admin'). Defaults to 'user'.
 * @returns {object} The newly created user object.
 * @throws {object} 400 error if required fields are missing.
 */
exports.create = (user, password_hash, role = 'user') => {
    if (!user || !password_hash) {
        throw { status: 400, message: "Brak wymaganych pól: user, password_hash" };
    }

    try {
        const info = db.prepare(
            'INSERT INTO users (user, password_hash, role, created_at) VALUES (?, ?, ?, datetime("now"))'
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


/**
 * Updates a user by ID (PATCH).
 * @param {number} id - The user ID.
 * @param {string} newUserName - Optional new username.
 * @param {string} newPass - Optional new password hash.
 * @param {string} newRole - Optional new role.
 * @returns {object} The updated user object.
 * @throws {object} 404 error if user not found.
 */
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

/**
 * Deletes a user by ID.
 * @param {number} id - The user ID.
 * @returns {object} The deleted user object.
 * @throws {object} 404 error if user not found.
 */
exports.remove = (id) => {
  const current = exports.getOne(id); // rzuci 404 jeśli nie ma

  db.prepare('DELETE FROM users WHERE id = ?').run(id);
  return current;
};