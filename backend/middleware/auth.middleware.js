

const authService = require('../services/auth.service');

/**
 * Middleware weryfikujący token sesji użytkownika
 * dodany do route'ów, które wymagają autoryzacji
 */
exports.requireAuth = (req, res, next) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ 
      error: 'Brak tokena autoryzacji. Musisz być zalogowany.' 
    });
  }

  try {
    const session = authService.validateSession(token);
    // Dodaj dane użytkownika do req
    req.user = session;
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: error.message || 'Nieprawidłowy lub wygasły token.' 
    });
  }
};

/**
 * Middleware weryfikujący czy użytkownik jest adminem
 * Wymaga wcześniejszego użycia requireAuth
 */
exports.requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Brak autoryzacji.' 
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Brak uprawnień. Wymagana rola: admin.' 
    });
  }

  next();
};
