const mongoose = require('mongoose');
const Desafio = require('../models/Desafios');
const Ranking = require('../models/RankingSchema');
const Athlete = require('../models/Athlete');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: 'df6jf1tux',
  api_key: '653415176186939',
  api_secret: 'yJrfipebj0AEn67wGvVIHW-4MCg',
});

// Função para enviar a imagem para o Cloudinary
const uploadImageToCloudinary = async (filePath, publicId) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'desafios/',
      public_id: publicId,
      overwrite: true,
    });
    return result;
  } catch (error) {
    console.error("Erro ao enviar para o Cloudinary:", error);
    throw new Error("Falha ao enviar imagem para o Cloudinary.");
  }
};

// Configuração do multer para upload de imagem
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/desafios/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nome único para a imagem
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
}).single('imagem');

// Função para criar desafio
exports.criarDesafio = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log('Erro ao fazer upload da imagem:', err.message);
      return res.status(400).json({
        success: false,
        message: 'Erro ao fazer upload da imagem',
        error: err.message,
      });
    }

    try {
      let imagemUrl = null;

      if (req.file) {
        // Enviar a imagem para o Cloudinary
        const result = await uploadImageToCloudinary(req.file.path, `${Date.now()}-${req.file.filename}`);
        imagemUrl = result.secure_url; // URL segura da imagem armazenada no Cloudinary
      }

      const novoDesafio = new Desafio({
        ...req.body,
        imagem: imagemUrl, // Salvando a URL da imagem no Cloudinary
      });

      await novoDesafio.save();
      res.status(201).json({
        success: true,
        data: novoDesafio,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erro ao criar desafio',
        error: error.message,
      });
    }
  });
};

// Função para alterar um desafio
exports.alterarDesafio = async (req, res) => {
  const { id } = req.params; // ID do desafio a ser alterado
  const atualizacoes = req.body; // Dados enviados no corpo da requisição

  try {
    const desafioAtualizado = await Desafio.findByIdAndUpdate(id, atualizacoes, { new: true });

    if (!desafioAtualizado) {
      return res.status(404).json({ message: 'Desafio não encontrado' });
    }

    res.status(200).json({ message: 'Desafio atualizado com sucesso', Desafio: desafioAtualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar o Desafio', error });
  }
};

// Função para buscar treinos com filtros
exports.buscarDesafio = async (req, res) => {
  try {
    // Extrai os filtros da query string (parâmetros da URL)
    const { nivel, tipo, duracao } = req.query;

    // Cria um objeto de filtros com base nos parâmetros fornecidos
    let filtros = {};

    if (nivel) {
      filtros.nivel = nivel; // Filtra pelo nível, caso esteja presente
    }
    if (tipo) {
      filtros.tipo = tipo; // Filtra pelo tipo de Desafio, caso esteja presente
    }
    if (duracao) {
      filtros.duracao = { $lte: duracao }; // Filtra pela duração (menor ou igual a)
    }

    // Realiza a busca no banco de dados com os filtros aplicados
    const desafios = await Desafio.find(filtros);

    // Retorna os treinos encontrados
    res.status(200).json(desafios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar os Desafios' });
  }
};

// Função para obter todos os desafios
exports.obterTodosDesafios = async (req, res) => {
  try {
    console.log('Buscando todos os desafios...');
    // Buscar todos os desafios
    const desafios = await Desafio.find(); // ou .find({}) para pegar todos os registros

    if (!desafios || desafios.length === 0) {
      return res.status(404).json({ message: 'Nenhum desafio encontrado.' });
    }
    console.log(desafios);
    res.status(200).json({
      message: 'Desafios encontrados com sucesso.',
      desafios: desafios,
    });
  } catch (error) {
    console.error('Erro ao buscar desafios:', error);
    res.status(500).json({ message: 'Erro ao buscar desafios.', error });
  }
};

// Função para declarar conclusão de desafio e adicionar pontos ao atleta
exports.concluirDesafio = async (req, res) => {
  try {
    const { desafiosId, atletaId } = req.body;

    if (!atletaId) {
      return res.status(400).json({ success: false, message: 'ID do atleta não encontrado.' });
    }

    const desafio = await Desafio.findById(desafiosId);
    if (!desafio) {
      return res.status(404).json({ success: false, message: 'Desafio não encontrado' });
    }

    const atleta = await Athlete.findById(atletaId);
    if (!atleta) {
      return res.status(404).json({ success: false, message: 'Atleta não encontrado' });
    }

    const desafioConcluido = atleta.desafiosConcluidos.some(
      (d) => d.desafioId.toString() === desafiosId
    );

    if (desafioConcluido) {
      return res.status(400).json({
        success: false,
        message: 'Desafio já concluído.',
        concluido: true, // ← Aqui está o que você precisa
      });
    }

    atleta.desafiosConcluidos.push({
      desafioId: new mongoose.Types.ObjectId(desafiosId),
      dataConclusao: new Date(),
    });

    desafio.quantidadeConclusao += 1;

    await atleta.save();
    await desafio.save();

    res.json({
      success: true,
      message: 'Desafio concluído com sucesso e adicionado à lista.',
      concluido: true, // também pode retornar isso aqui
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erro ao concluir o desafio.',
      error: error.message,
    });
  }
};


exports.deletarDesafio = async (req, res) => {
  console.log('ENTROU NA ROTA');
  console.log('ID recebido:', req.params.id); // Verifica o ID recebido
  const { id } = req.params;

  try {
    const desafioRemovido = await Desafio.findByIdAndDelete(id);
    if (!desafioRemovido) {
      console.log('Desafio não encontrado');
      return res.status(404).json({ message: 'Desafio não encontrado' });
    }
    res.status(200).json({ message: 'Desafio deletado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar o desafio', error });
  }
};

// Rota para obter um desafio específico pelo ID
exports.obterDesafioPorId = async (req, res) => {
  console.log('ID recebido para buscar o desafio:', req.params.id); // Verifica o ID recebido
  const { id } = req.params;

  try {
    // Busca o desafio pelo ID
    const desafio = await Desafio.findById(id);
    if (!desafio) {
      console.log('Desafio não encontrado');
      return res.status(404).json({ message: 'Desafio não encontrado' });
    }
    // Retorna o desafio encontrado
    res.status(200).json(desafio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar o desafio', error });
  }
};

exports.obterDesafiosEmAlta = async (req, res) => {
  try {
    // Buscar os desafios ordenados pela quantidade de conclusão
    const desafiosEmAlta = await Desafio.aggregate([
      { $sort: { quantidadeConclusao: -1 } },
      { $limit: 5 }
    ]);

    // Se houver menos de 5 desafios, retorna apenas a metade
    if (desafiosEmAlta.length < 5) {
      const metade = Math.ceil(desafiosEmAlta.length / 2); // CORRIGIDO AQUI
      return res.json(desafiosEmAlta.slice(0, metade)); // Retorna o conteúdo completo
    }

    // Retorna todos os dados dos desafios em alta
    res.json(desafiosEmAlta); // Retorna o conteúdo completo
  } catch (error) {
    console.error("Erro ao buscar desafios:", error);
    res.status(500).json({ message: "Erro ao buscar desafios.", error });
  }
};


