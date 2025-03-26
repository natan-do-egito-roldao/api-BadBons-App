// backend/middleware/adminAuthMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyAdminTokenHeader = async (req, res, next) => {
    // mostrando url que foi enviada
    console.log("VERIFICANDO", req.url);
    const authHeader = req.headers.authorization; // Obtém o token do cabeçalho
    console.log("hEADER", authHeader, req.url);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token não fornecido ou formato inválido.' });
    }

    const token = authHeader.split(' ')[1]; // Extrai o token
    console.log('TOKEN ENVIADO', token);

    // Verifica o token JWT
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(401).json({ message: 'Token inválido o777u expirado.' });
        }
        // Token válido e autorizado
        req.admin = decoded;
        next();
    });
};

module.exports = verifyAdminTokenHeader;