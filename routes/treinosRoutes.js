const express = require('express');
const router = express.Router();
const verifyAdminTokenHeader = require('../middleware/adminAuthMiddlewareHeader');
const { criarTreino, alterarTreino, buscarTreinos, buscarTreino, deletarTreino } = require('../controllers/treinosController');

router.get('/:treinoId', buscarTreino);

// Rota para buscar treinos com filtros
router.post('/buscar', buscarTreinos);

router.use(verifyAdminTokenHeader);

// Rota para criar um treino
router.post('/', criarTreino);

// Rota para alterar um treino
router.put('/:id', alterarTreino);

// Rota para deletar um treino pelo ID
router.delete('/:treinoId', deletarTreino);

module.exports = router;
