const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Athlete'); // Certifique-se de que o modelo está importado corretamente

// Rota de login
router.post('/login', async (req, res) => {
    try {
        console.log("requisicao chegou para login")
        console.log(req.body);
        const { email, password } = req.body;

        // Verifica se o usuário existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Usuário não encontrado' });
        }

        // Verifica se a senha do usuário está disponível para comparação
        if (!user.password) {
            return res.status(400).json({ message: 'Senha do usuário não está definida.' });
        }

        // Verifica se a senha corresponde à senha criptografada
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Senha incorreta' });
        }

        // Gera um token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const userId = user._id;

        // Retorna o token JWT ao cliente
        res.status(200).json({ message: 'Login realizado com sucesso', token, userId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor ao fazer login' });
    }
});

// Rota de logout (opcional, se você quiser implementar uma blacklist)
router.post('/logout', (req, res) => {
    try {
        // Invalida o token no lado do cliente
        res.status(200).json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor ao fazer logout' });
    }
});

module.exports = router;