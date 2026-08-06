const jwt = require('jsonwebtoken');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is required in production');
  }
  return secret || 'local-development-only-secret';
}

function authenticate(req, res, next) {
  try {
    const authorization = req.get('authorization') || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    const payload = jwt.verify(token, getJwtSecret());
    req.userId = String(payload.userId);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired authentication token' });
  }
}

module.exports = { authenticate, getJwtSecret };

