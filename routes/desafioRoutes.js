const express = require('express');
const router = express.Router();
const verifyAdminTokenHeader = require('../middleware/adminAuthMiddlewareHeader');
const { criarDesafio, alterarDesafio, buscarDesafio, concluirDesafio, obterTodosDesafios, deletarDesafio, obterDesafioPorId, obterDesafiosEmAlta } = require('../controllers/desafioController');


router.get('/detalhe-desafio/:id', obterDesafioPorId);

// rota para concluir desafio
router.post('/concluir-desafio/:id', concluirDesafio);

// Rota para criar um Desafio
router.post('/criar', criarDesafio);

// Rota para buscar Desafio com filtros
router.get('/buscar', buscarDesafio);

// Rota para alterar um Desafio
router.put('/:id', alterarDesafio);

// Rota para obter todos os desafios
router.get('/obter-desafios', obterTodosDesafios);

router.delete('/deletar/:id', deletarDesafio);

// Rota para obter todos os desafios
router.get('/obter-desafiosEmAlta', obterDesafiosEmAlta);


module.exports = router;
