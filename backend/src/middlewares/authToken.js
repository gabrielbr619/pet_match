const jwt = require('jsonwebtoken');

exports.authToken = (req, res, next) => {
    if (!req.header('Authorization')) {
        return res.status(401).json({ error: 'Token is required' });
    }
    const token = req.header('Authorization').replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Armazena a carga útil decodificada no objeto de solicitação
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token: ' + err.message });
    }
};
