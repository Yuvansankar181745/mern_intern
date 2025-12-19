const auth = require('./auth');

const admin = async (req, res, next) => {
  // First check authentication
  await auth(req, res, () => {
    // Then check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    next();
  });
};

module.exports = admin;

