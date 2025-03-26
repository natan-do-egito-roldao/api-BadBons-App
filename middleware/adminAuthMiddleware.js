// backend/middleware/adminAuthMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyAdminToken = async (req, res, next) => {
    const { token} = req.body; // Token no corpo da requisição
    console.log(token);

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    // Verifica o token JWT
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido ou expirado.' });
        }

        // Verifica se o email do token corresponde ao email do administrador
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ message: 'Acesso não autorizado.' });
        }

        // Token válido e autorizado
        req.admin = decoded;
        next();
    });
};

module.exports = verifyAdminToken;
