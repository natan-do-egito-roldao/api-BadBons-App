const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Athlete = require('../models/Athlete');
const Treino = require('../models/Treinos');
const verifyAdminTokenHeader = require('../middleware/adminAuthMiddlewareHeader');
const rankingSchema = require('../models/RankingSchema');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const router = express.Router();

// Configuração do Cloudinary
cloudinary.config({
    cloud_name: 'df6jf1tux',
    api_key: '653415176186939',
    api_secret: 'yJrfipebj0AEn67wGvVIHW-4MCg',
  });
  
  const uploadImage = async (filePath, publicId) => {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'perfil/',
        public_id: publicId,
        overwrite: true,
      });
      return result;
    } catch (error) {
      console.error("Erro ao enviar para o Cloudinary:", error);
      throw new Error("Falha ao enviar imagem para o Cloudinary.");
    }
  };

// Configuração do Multer para armazenar temporariamente os arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Diretório onde os arquivos serão salvos temporariamente
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nome do arquivo com timestamp
  },
});

const upload = multer({ storage });

// Agora você pode usar o middleware `upload` em sua rota
router.put('/:id/foto-perfil', upload.single('fotoPerfil'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Nenhuma imagem enviada.' });
    }

    const atleta = await Athlete.findById(id);
    if (!atleta) {
      return res.status(404).json({ success: false, message: 'Atleta não encontrado.' });
    }

    // Enviar a imagem para o Cloudinary
    console.log('Enviando imagem para o Cloudinary...', req.file.path);
    const result = await uploadImage(req.file.path, `${id}-foto-perfil`);

    // Atualiza a URL da imagem no banco de dados
    atleta.fotoPerfil = result.secure_url;
    console.log('Rankings encontrados:', atleta.rankingCorrespondente);
    const ranking = await rankingSchema.findById(atleta.rankingCorrespondente);

    if (!ranking) {
    console.error(`Ranking não encontrado para o atleta com ID ${id}.`);
    return;
    }

    console.log('Ranking encontrado:', ranking);

    if (!ranking.players || !Array.isArray(ranking.players)) {
    console.warn(`O ranking ${ranking._id} não tem alunos ou o campo alunos não é um array.`);
    return;
    }

    const aluno = ranking.players.find(aluno => aluno.athlete.toString() === id);

    if (aluno) {
    aluno.fotoPerfil = result.secure_url;
    await ranking.save();
    console.log(`Foto de perfil atualizada para o atleta ${id} no ranking ${ranking._id}`);
    } else {
    console.warn(`Atleta ${id} não encontrado no ranking ${ranking._id}`);
    }
    await atleta.save();

    // Responde com a URL da imagem armazenada no Cloudinary
    res.status(200).json({
      success: true,
      message: 'Foto de perfil atualizada com sucesso!',
      fotoPerfil: atleta.fotoPerfil,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar foto de perfil.', error: error.message });
  }
});

// Rota para deletar a foto de perfil do atleta
router.delete('/:id/foto-perfil', async (req, res) => {
    try {
        const { id } = req.params;
        const atleta = await Athlete.findById(id);
        if (!atleta) {
            return res.status(404).json({ success: false, message: 'Atleta não encontrado.' });
        }

        if (!atleta.fotoPerfil) {
            return res.status(400).json({ success: false, message: 'Este atleta não possui foto de perfil.' });
        }

        // Remove o arquivo da pasta 'uploads'
        const filePath = path.join(__dirname, '..', atleta.fotoPerfil);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Remove a referência da foto no banco de dados
        atleta.fotoPerfil = null;
        await atleta.save();

        res.status(200).json({ success: true, message: 'Foto de perfil removida com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro ao remover foto de perfil.', error: error.message });
    }
});

// Rota para solicitar a prova caso não tenha treinos pendentes
router.post('/:id/solicitar-prova', async (req, res) => {
    try {
        console.log('Solicitando prova...');
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido.' });
        }

        const atleta = await Athlete.findById(id);
        if (!atleta) {
            return res.status(404).json({ success: false, message: 'Atleta não encontrado.' });
        }
        console.log(atleta);
        if (atleta.treinosPendentes.length === 0) {
            atleta.statusNivel = 'Aguardando Prova';
            await atleta.save();
            return res.status(200).json({
                success: true,
                message: 'Solicitação de prova registrada com sucesso.',
                status: atleta.statusNivel
            });
            console
        } else {
            return res.status(400).json({
                success: false,
                message: 'Você ainda tem treinos pendentes. Não pode solicitar a prova.'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Erro ao solicitar prova.', error: error.message });
    }
});

// Rota para obter detalhes dos treinos de um atleta
router.get('/:id/treinos-detalhados', async (req, res) => {
    try {
      const { id } = req.params;
      console.log('ID', id);
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'ID inválido.' });
      }
  
      // Buscar o atleta com os treinos pendentes e concluídos
      const atleta = await Athlete.findById(id)
        .populate('treinosPendentes', 'nome descricao nivel duracao tipo fotoTreino')
        .populate('treinosConcluidos.treinoId', 'nome descricao nivel dataConclusao duracao tipo fotoTreino');
  
      if (!atleta) {
        return res.status(404).json({ success: false, message: 'Atleta não encontrado.' });
      }
  
      // Mapeando os treinos pendentes
      const treinosPendentes = atleta.treinosPendentes.map(tc => ({
        treinoId: tc._id,
        nome: tc.nome,
        descricao: tc.descricao,
        nivel: tc.nivel,
        duracao: tc.duracao,
        tipo: tc.tipo,
        fotoTreino: tc.fotoTreino // Incluindo a foto do treino
      }));
      const treinosConcluidos = atleta.treinosConcluidos
        .filter(tc => tc.treinoId && tc.treinoId._id) // Filtra os itens inválidos
        .map(tc => ({
            treinoId: tc.treinoId._id,
            dataConclusao: tc.dataConclusao,
            nome: tc.treinoId.nome,
            descricao: tc.treinoId.descricao,
            nivel: tc.treinoId.nivel,
            duracao: tc.treinoId.duracao,
            tipo: tc.treinoId.tipo,
            fotoTreino: tc.treinoId.fotoTreino
        }));

      console.log('ATE AQUI')
  
      return res.status(200).json({
        success: true,
        treinosPendentes,
        treinosConcluidos
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Erro ao buscar treinos.', error: error.message });
    }
  });
  

// Rota para concluir um treino
router.put('/:id/concluir-treino', async (req, res) => {
    try {
        
        const { treinoId } = req.body;
        console.log(treinoId);
        // Verificação de validade do treinoId
        if (!mongoose.Types.ObjectId.isValid(treinoId)) {
            return res.status(400).json({ error: 'ID do treino inválido' });
        }

        const { id } = req.params;
        console.log(`ID do Atleta: ${id}, ID do Treino: ${treinoId}`);

        // Busca o atleta e popula os treinos pendentes e concluídos
        const atleta = await Athlete.findById(id)
            .populate('treinosPendentes', 'nome descricao nivel duracao tipo')
            .populate('treinosConcluidos.treinoId', 'nome descricao nivel duracao tipo');

        if (!atleta) {
            return res.status(404).json({ error: 'Atleta não encontrado' });
        }

        // Verificar se o treino está presente nos treinos pendentes
        const treinoIndex = atleta.treinosPendentes.findIndex(treino => treino._id.toString() === treinoId);
        if (treinoIndex === -1) {
            return res.status(400).json({ error: 'Treino não encontrado em treinos pendentes' });
        }

        // Mover o treino de pendentes para concluídos
        atleta.treinosConcluidos.push({
            treinoId: treinoId,
            dataConclusao: new Date(),
        });

        // Remover o treino dos pendentes
        atleta.treinosPendentes.splice(treinoIndex, 1);

        // Salvar as alterações no banco de dados
        await atleta.save();

        // Resposta de sucesso
        res.status(200).json({
            success: true,
            message: 'Treino concluído com sucesso',
            atleta,
        });
    } catch (error) {
        // Log de erro para ajudar no debug
        console.error('Erro ao concluir treino:', error);
        res.status(500).json({ error: error.message });
    }
});


// Rota para obter atletas com filtros e paginação
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filters = {};
        if (req.query.nivel) {
            filters.nivel = req.query.nivel;
        }
        if (req.query.idade) {
            filters.idade = { $gte: req.query.idade };
        }
        if (req.query.nome) {
            filters.nome = { $regex: req.query.nome, $options: 'i' };
        }

        const athletes = await Athlete.find(filters).skip(skip).limit(limit);
        const totalAthletes = await Athlete.countDocuments(filters);
        const totalPages = Math.ceil(totalAthletes / limit);

        res.status(200).json({
            totalPages,
            currentPage: page,
            athletes,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao obter atletas.' });
    }
});

// Rota para obter treinos pendentes e concluídos de um aluno
router.get('/grafico/:alunoId', async (req, res) => {
    try {
        const { alunoId } = req.params;

        const aluno = await Athlete.findById(alunoId);

        if (!aluno) {
            return res.status(404).json({
                success: false,
                message: 'Aluno não encontrado.',
            });
        }

        res.status(200).json({
            success: true,
            treinosPendentes: aluno.treinosPendentes,
            treinosConcluidos: aluno.treinosConcluidos,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar treinos do aluno.',
            error: error.message,
        });
    }
});

// Rota para obter um atleta específico
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID inválido.' });
        }

        const athlete = await Athlete.findById(id)
            .populate('treinosPendentes', '_id')
            .populate('treinosConcluidos.treinoId', '_id');

        if (!athlete) {
            return res.status(404).json({ message: 'Atleta não encontrado.' });
        }

        // Contar o número de treinos pendentes
        const totalTreinosPendentes = athlete.treinosPendentes.length;

        // Contar o número de treinos concluídos
        const totalTreinosConcluidos = athlete.treinosConcluidos.length;
        console.log('Treinos concluídos:', totalTreinosConcluidos);
        console.log('Treinos pendentes:', totalTreinosPendentes);

        // Calcular a porcentagem de progresso
        const totalTreinos = totalTreinosPendentes + totalTreinosConcluidos;
        const progresso = totalTreinos > 0 ? (totalTreinosConcluidos / totalTreinos) * 100 : 0;

        // Atualizar os campos treinosTotais, treinosFeitos e progresso
        athlete.treinosTotais = totalTreinosPendentes;
        athlete.treinosFeitos = totalTreinosConcluidos;
        athlete.progresso = progresso;
        await athlete.save();

        res.status(200).json({
            athlete,
            totalTreinosPendentes,
            totalTreinosConcluidos,
            progresso
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao obter o atleta.' });
    }
});

// Aplicando o middleware de verificação do admin em todas as rotas a partir daqui
router.use(verifyAdminTokenHeader);

router.post('/revisar-aluno', async (req, res) => {
    try {
        console.log('Revisando aluno...');
        const { alunoId, status, treinosReprovados } = req.body;
        console.log('Aluno:', alunoId);
        console.log('Status:', status);
        console.log('Treinos reprovados:', treinosReprovados);
        
        const aluno = await Athlete.findById(alunoId)
            .populate('treinosPendentes', 'nome descricao nivel duracao tipo')
            .populate('treinosConcluidos.treinoId', 'nome descricao nivel duracao tipo');

        if (!aluno) {
            return res.status(404).json({ success: false, message: 'Aluno não encontrado.' });
        }

        aluno.statusNivel = status;

        if (status === 'Aprovado' && aluno.nivel < 3) {
            aluno.nivel += 1;
        }

        if (status === 'Reprovado' && Array.isArray(treinosReprovados)) {
            aluno.treinosReprovados = treinosReprovados;
        
            // Diminuir o número de treinos reprovados do total de treinos feitos
            aluno.treinosFeitos -= treinosReprovados.length;
            if (aluno.treinosFeitos < 0) {
                aluno.treinosFeitos = 0; // Garantir que não fique negativo
            }
        
            // Mover treinos reprovados de treinosConcluidos para treinosPendentes
            treinosReprovados.forEach(treinoId => {
                // Remover de treinosConcluidos com base no treinoId
                aluno.treinosConcluidos = aluno.treinosConcluidos.filter(tc => tc.treinoId._id.toString() !== treinoId);
        
                // Verificar se o treino já está em treinosPendentes
                const treinoJaAdicionado = aluno.treinosPendentes.some(tp => tp._id.toString() === treinoId);
                
                // Adicionar a treinosPendentes se não estiver lá
                if (!treinoJaAdicionado) {
                    aluno.treinosPendentes.push({
                        _id: treinoId,
                        fases: [],
                        dataCriacao: new Date()
                    });
                }
            });
        }
        

        // Buscar novos treinos com o mesmo nível do aluno
        const nivelAluno = aluno.nivel;
        const treinosDoNivel = await Treino.find({ nivel: nivelAluno });

        // Adicionar os novos treinos ao aluno, caso não estejam em treinosPendentes ou treinosConcluidos
        for (const treino of treinosDoNivel) {
            const treinoIdNivel = treino._id.toString();

            // Verificar se o treino já não está em treinosPendentes ou treinosConcluidos
            const treinoJaAdicionado = aluno.treinosPendentes.some(t => t._id.toString() === treinoIdNivel) ||
            aluno.treinosConcluidos.some(t => t.treinoId._id.toString() === treinoIdNivel);

            if (!treinoJaAdicionado) {
                // Adicionar treino aos treinosPendentes
                aluno.treinosPendentes.push(treino);
            }
        }

        console.log('treinosConcluidos', aluno.treinosConcluidos);
        console.log('treinosPendentes', aluno.treinosPendentes);

        // Recalcular o progresso com base nos valores atualizados de treinosTotais e treinosFeitos
        const totalTreinos = aluno.treinosTotais + aluno.treinosFeitos;
        aluno.progresso = totalTreinos > 0 ? Math.floor((aluno.treinosFeitos / totalTreinos) * 100) : 0;

        await aluno.save();

        res.status(200).json({
            success: true,
            message: 'Avaliação do aluno concluída com sucesso!',
            aluno
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Erro ao revisar o aluno.',
            error: error.message,
        });
    }
});



// Rota para criar um atleta com autenticação de admin
router.post('/', async (req, res) => {
    try {
        console.log('criando');
        const { nome, idade, email, telefone, sexo, isProfessor, nivel = Number(req.body.nivel), password } = req.body;

        if (!nome || !nivel) {
            return res.status(400).json({ success: false, message: 'Nome e nível são obrigatórios.' });
        }

        const treinos = await Treino.find({ nivel: { $lte: nivel } });

        if (treinos.length === 0) {
            return res.status(404).json({ message: 'Nenhum treino encontrado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAthlete = new Athlete({
            nome,
            idade,
            email,
            telefone,
            isProfessor,
            sexo,
            nivel,
            password: hashedPassword,
            treinosPendentes: treinos.map(treino => treino._id),
        });

        await newAthlete.save();

        res.status(201).json({
            message: 'Atleta criado com sucesso!',
            athlete: newAthlete,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao criar atleta.' });
    }
});

// Rota para atualizar um atleta pelo ID
router.put('/:id', async (req, res) => {
    try {
        const atletaAtualizado = await Athlete.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!atletaAtualizado) return res.status(404).json({ error: 'Atleta não encontrado' });
        res.status(200).json(atletaAtualizado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rota para deletar um atleta pelo ID
router.delete('/:id', async (req, res) => {
    try {
        const atletaDeletado = await Athlete.findByIdAndDelete(req.params.id);
        if (!atletaDeletado) return res.status(404).json({ error: 'Atleta não encontrado' });
        res.status(200).json({ message: 'Atleta deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;