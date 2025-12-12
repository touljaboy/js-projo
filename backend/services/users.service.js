// -----------------------------
// USER SERVICE (MOCK DB)
// -----------------------------

// Mock users data
let users = [
    { id: 1, user: 'brian', password_hash: 'mockhash1', role: 'user', created_at: new Date().toISOString() },
    { id: 2, user: 'joshua', password_hash: 'mockhash2', role: 'user', created_at: new Date().toISOString() },
    { id: 3, user: 'mirabell', password_hash: 'mockhash3', role: 'user', created_at: new Date().toISOString() },
    { id: 4, user: 'admin', password_hash: 'admin123', role: 'admin', created_at: new Date().toISOString() },
];
let nextUserId = 5; // Start from 5

/**
 * Retrieves all users.
 */
exports.getAll = () => {
    return users;
};

/**
 * Retrieves a single user by ID.
 * @param {number} id - The user ID.
 * @returns {object} The user object.
 * @throws {object} 404 error if user not found.
 */
exports.getOne = (id) => {
    const user = users.find(u => u.id === id);
    if (!user) {
        // Throw exception that controller will catch
        throw { status: 404, message: `Użytkownik o ID ${id} nie został znaleziony.` };
    }
    return user;
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

    const newUser = {
        id: nextUserId++,
        user,
        password_hash,
        role: role || 'user', // Domyślnie wszyscy nowi użytkownicy mają rolę 'user'
        created_at: new Date().toISOString(),
    };

    users.push(newUser);
    return newUser;
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
    const user = exports.getOne(id); // Use getOne to check existence (throws 404 if not found)

    if (newUserName !== undefined) user.user = newUserName;
    if (newPass !== undefined) user.password_hash = newPass;
    if (newRole !== undefined) user.role = newRole;

    return user;
};

/**
 * Deletes a user by ID.
 * @param {number} id - The user ID.
 * @returns {object} The deleted user object.
 * @throws {object} 404 error if user not found.
 */
exports.remove = (id) => {
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
        throw { status: 404, message: `Użytkownik o ID ${id} nie został znaleziony.` };
    }

    const [deleted] = users.splice(index, 1);
    return deleted;
};