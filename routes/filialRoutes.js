const express = require('express');
const router = express.Router();
const Filial = require('../models/Filial'); // importa o modelo Filial
const verifyAdminToken = require('../middleware/adminAuthMiddleware'); // Middleware para autenticação do admin

// Aplicando o middleware de verificação do admin em todas as rotas
router.use(verifyAdminToken); // Agora todas as rotas desta rota estarão protegidas


// Rota para criar uma nova filial(POST)
router.post('/', async (req, res) => {
    try {
        // extrai os dados da filial enviados no corpo da requisição 
        const { nome, endereco, telefone, valorDiaria, ativa, bairro } = req.body;

        // cria uma nova filial com os dados recebidos
        const newFilial = new Filial({
            nome,
            endereco,
            telefone,
            valorDiaria,
            ativa,
            bairro
        });

        // salva a filial no banco de dados
        await newFilial.save();

        // retorna a filial criada com um status 201
        res.status(201).json(newFilial);
    } catch (error) {
        console.error("Erro ao criar filial:", error.message); // Loga a mensagem de erro
        //retorna um erro 500 em caso de falha
        res.status(500).json({ error: 'Error ao criar filial'});
    }
});

// Rota para buscar todas as filiais (GET)
router.get('/', async (req, res) => {
    try {
        // Busca todas as filiais no banco de dados
        const filiais = await Filial.find();

        // Retorna a lista de filiais com status 200
        res.status(200).json(filiais);
    } catch (error) {
        // Retorna erro 500 caso ocorra algum problema
        res.status(500).json({ error: 'Erro ao buscar filiais' });
    }
});

// Rota para buscar uma filial específica por ID (GET)
router.get('/:id', async (req, res) => {
    try {
        // Busca a filial pelo ID fornecido
        const filial = await Filial.findById(req.params.id);

        // Se a filial não for encontrada, retorna erro 404
        if (!filial) {
            return res.status(404).json({ error: 'Filial não encontrada' });
        }

        // Retorna a filial encontrada com status 200
        res.status(200).json(filial);
    } catch (error) {
        // Retorna erro 500 em caso de falha
        res.status(500).json({ error: 'Erro ao buscar filial' });
    }
});

// Rota para atualizar uma filial específica (PUT)
router.put('/:id', async (req, res) => {
    try {
        // Extrai os dados da requisição
        const { nome, endereco, telefone, valorDiaria, ativa, bairro } = req.body;

        // Atualiza a filial com base no ID e nos dados fornecidos
        const updatedFilial = await Filial.findByIdAndUpdate(
            req.params.id,
            { nome, endereco, telefone, valorDiaria, ativa, bairro },
            { new: true } // Retorna o documento atualizado
        );

        // Se a filial não for encontrada, retorna erro 404
        if (!updatedFilial) {
            return res.status(404).json({ error: 'Filial não encontrada' });
        }

        // Retorna a filial atualizada com status 200
        res.status(200).json(updatedFilial);
    } catch (error) {
        // Retorna erro 500 em caso de falha
        res.status(500).json({ error: 'Erro ao atualizar filial' });
    }
});

// Rota para excluir uma filial (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        // Exclui a filial com base no ID fornecido
        const deletedFilial = await Filial.findByIdAndDelete(req.params.id);

        // Se a filial não for encontrada, retorna erro 404
        if (!deletedFilial) {
            return res.status(404).json({ error: 'Filial não encontrada' });
        }

        // Retorna a filial excluída com status 200
        res.status(200).json({ message: 'Filial excluída com sucesso' });
    } catch (error) {
        // Retorna erro 500 em caso de falha
        res.status(500).json({ error: 'Erro ao excluir filial' });
    }
});

module.exports = router;