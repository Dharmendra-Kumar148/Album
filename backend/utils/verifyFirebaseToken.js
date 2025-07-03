const admin = require('../firebase');

module.exports = async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; // ✅ req.user.uid will now be available
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
