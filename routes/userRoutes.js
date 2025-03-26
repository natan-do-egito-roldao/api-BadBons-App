// backend/routes/userRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config(); // Carrega as variáveis do .env

// Rota para login do administrador
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica se as credenciais são iguais às do administrador no .env
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // Gera um token JWT
      const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ message: 'Login bem-sucedido', token });
    }

    // Responde com erro se as credenciais estiverem incorretas
    res.status(401).json({ message: 'Credenciais inválidas' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao realizar login do administrador' });
  }
});

module.exports = router;
