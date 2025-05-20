const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
    try {
        // Allow login route to pass through
        if (req.path === '/' && req.method === 'POST') return next();
        
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findByPk(decoded.id, {
            attributes: ['id', 'username', 'role', 'isEnabled'] // Add this
            });

        if (!user || !user.isEnabled) {
            console.log('User status:', user?.isEnabled); // Debug log
             return res.status(401).json({ error: 'Invalid account' });
            }

         req.user = {
            id: user.id,
            username: user.username,
            role: user.role
        };
        next();
    } catch (err) {
        console.error('Auth error:', err);
        res.status(401).json({ error: 'Invalid token' });
    }
};