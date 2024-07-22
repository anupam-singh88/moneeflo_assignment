const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

module.exports = function (req, res, next) {
    const header = req.header('Authorization');
    const token = header?.split(' ')[1];

    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    //split the bearer

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
