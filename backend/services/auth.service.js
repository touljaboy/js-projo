// -----------------------------
// AUTH SERVICE
// -----------------------------

const usersService = require('./users.service');

// Mock session storage (w produkcji użyj Redis lub bazy danych)
const sessions = new Map();

exports.register = (username, password, email, pesel) => {
    if (!username || !password) {
        const error = new Error('Username i password są wymagane.');
        error.status = 400;
        throw error;
    }

    // Sprawdź czy użytkownik już istnieje
    const allUsers = usersService.getAll();
    const existingUser = allUsers.find(u => u.user === username);
    
    if (existingUser) {
        const error = new Error('Użytkownik o tej nazwie już istnieje.');
        error.status = 409;
        throw error;
    }

    // Utwórz nowego użytkownika
    const newUser = usersService.create(username, password);
    
    // Zwróć użytkownika bez hasła
    const { password_hash, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};

exports.login = (username, password) => {
    if (!username || !password) {
        const error = new Error('Username i password są wymagane.');
        error.status = 400;
        throw error;
    }

    const allUsers = usersService.getAll();
    const user = allUsers.find(u => u.user === username && u.password_hash === password);

    if (!user) {
        const error = new Error('Nieprawidłowy username lub password.');
        error.status = 401;
        throw error;
    }

    // Generuj prosty token sesji (w produkcji użyj JWT)
    const sessionToken = `session_${user.id}_${Date.now()}`;
    sessions.set(sessionToken, { userId: user.id, username: user.user });

    // Zwróć dane bez hasła
    const { password_hash, ...userWithoutPassword } = user;
    return {
        user: userWithoutPassword,
        token: sessionToken
    };
};

exports.validateSession = (token) => {
    const session = sessions.get(token);
    if (!session) {
        const error = new Error('Nieprawidłowa sesja.');
        error.status = 401;
        throw error;
    }
    return session;
};

exports.logout = (token) => {
    sessions.delete(token);
    return { message: 'Wylogowano pomyślnie.' };
};
