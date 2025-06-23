// backend/routes/adminAuthRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '/etc/secrets/.env' });

const router = express.Router();

// Rota de login do administrador
router.post('/admin-login', async (req, res) => {
    const { email, password } = req.body;

    // Verifica se o email e a senha são iguais aos definidos para o admin
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        try {
            // Gera o token JWT com a identificação de administrador
            const token = jwt.sign(
                { email }, // Informações do payload (neste caso, o email)
                process.env.JWT_SECRET, // Chave secreta (deve ser configurada no .env)
                { expiresIn: '2h' } // Configuração de expiração do token
            );

            // Retorna o token JWT para o cliente
            return res.status(200).json({
                message: 'Login de administrador bem-sucedido',
                token, // Retorna o token gerado
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Erro ao gerar o token',
                error: error.message,
            });
        }
    } else {
        return res.status(401).json({
            message: 'Credenciais inválidas',
        });
    }
});

module.exports = router;
