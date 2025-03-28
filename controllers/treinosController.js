const Treino = require('../models/Treinos');
const Athlete = require('../models/Athlete');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
// Configuração do multer para fazer upload de arquivos
const storage = multer.memoryStorage(); // Usando a memória para armazenar o arquivo temporariamente
const upload = multer({ storage: storage }).single('fotoTreino'); // O campo 'fotoTreino' deve ser o nome do campo do formulário

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: 'df6jf1tux',
  api_key: '653415176186939',
  api_secret: 'yJrfipebj0AEn67wGvVIHW-4MCg',
});

// Função para upload da imagem para o Cloudinary
const uploadImageToCloudinary = (fileBuffer, filename) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'treinos', public_id: filename },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result); // Retorna o resultado com a URL da imagem
      }
    ).end(fileBuffer); // Envia o buffer do arquivo
  });
};

exports.criarTreino = async (req, res) => {
  console.log('criando treino...')
  // Processa a requisição de upload de imagem
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
      let fotoUrl = null;

      // Verifica se há uma imagem para ser enviada para o Cloudinary
      if (req.file) {
        const result = await uploadImageToCloudinary(req.file.buffer, `${Date.now()}-${req.file.originalname}`);
        fotoUrl = result.secure_url; // URL segura da imagem armazenada no Cloudinary
      }

      const { fases, fotoTreino, ...treinoData } = req.body;

      // Cria o treino com os dados recebidos
      const novoTreino = await Treino.create({
        ...treinoData,
        fotoTreino: fotoUrl || fotoTreino, // Se tiver uma foto, usa a do Cloudinary, caso contrário usa a fotoTreino recebida
        fases: fases ? JSON.parse(fases) : [], // Certifica-se de que as fases estão no formato correto
      });

      // Buscar atletas ativos que têm o mesmo nível ou superior ao do treino
      const atletasParaAtualizar = await Athlete.find({ nivel: { $gte: novoTreino.nivel } });

      // Atualiza os atletas com o treino
      if (novoTreino.polo === false) {
        await Athlete.updateMany(
          { nivel: { $gte: novoTreino.nivel } },
          { $push: { treinosPendentes: novoTreino._id } }
        );
      }

      // Retorna a resposta de sucesso
      res.status(201).json({
        success: true,
        data: novoTreino,
        message: `Treino criado com ${fases?.length || 0} fases e adicionado a ${atletasParaAtualizar.length} atletas pendentes.`,
      });
    } catch (error) {
      console.error('Erro ao criar treino:', error);
      res.status(400).json({
        success: false,
        message: 'Erro ao criar treino',
        error: error.message,
      });
    }
  });
};
exports.alterarTreino = async (req, res) => {
  const { id } = req.params; // ID do treino a ser alterado
  const atualizacoes = req.body; // Dados enviados no corpo da requisição

  try {
      // Busca o treino pelo ID e atualiza com os dados fornecidos
      const treinoAtualizado = await Treino.findByIdAndUpdate(id, atualizacoes, { new: true });

      // Verifica se o treino foi encontrado
      if (!treinoAtualizado) {
          return res.status(404).json({ message: 'Treino não encontrado' });
      }

      // Retorna o treino atualizado
      res.status(200).json({ message: 'Treino atualizado com sucesso', treino: treinoAtualizado });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar o treino', error });
  }
};

// Função para buscar treinos com filtros
exports.buscarTreinos = async (req, res) => {
  try {
    console.log(req.body);
    // Extrai os filtros do corpo da requisição (JSON)
    const { nivel, tipo, duracao, nome } = req.body;

    // Cria um objeto de filtros com base nos parâmetros fornecidos
    let filtros = {};

    if (nivel) {
      filtros.nivel = nivel; // Filtra pelo nível, caso esteja presente
    }
    if (tipo) {
      filtros.tipo = tipo; // Filtra pelo tipo de treino, caso esteja presente
    }
    if (duracao) {
      filtros.duracao = { $lte: duracao }; // Filtra pela duração (menor ou igual a)
    }
    if (nome) {
      // Usa expressão regular para buscar nomes que contenham as mesmas letras na ordem
      filtros.nome = { $regex: nome, $options: 'i' }; // 'i' para case-insensitive
    }

    // Realiza a busca no banco de dados com os filtros aplicados
    const treinos = await Treino.find(filtros);

    // Retorna os treinos encontrados
    res.status(200).json(treinos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar os treinos', error });
  }
};

// Função para buscar detalhes de um treino pelo ID
exports.buscarTreino = async (req, res) => {
  try {
    console.log('Função para buscar detalhes de um treino pelo ID');
    const { treinoId } = req.params; // Captura o ID da URL

    // Busca o treino no banco de dados pelo ID
    const treino = await Treino.findById(treinoId);

    if (!treino) {
      return res.status(404).json({ message: 'Treino não encontrado' });
    }

    console.log(treino);
    // Retorna os detalhes do treino
    res.status(200).json(treino);
  } catch (error) {
    console.error('Erro ao buscar treino:', error);
    res.status(500).json({ message: 'Erro ao buscar treino', error });
  }
};

// Função para deletar um treino pelo IDexports.deletarTreino = async (req, res) => {
exports.deletarTreino = async (req, res) => {
  try {
    console.log('Função para deletar um treino pelo ID');
    const { treinoId } = req.params; // Captura o ID da URL

    // Deleta o treino no banco de dados pelo ID
    const treinoDeletado = await Treino.findByIdAndDelete(treinoId);

    if (!treinoDeletado) {
      return res.status(404).json({ message: 'Treino não encontrado' });
    }

    // Remove o treino dos arrays de treinosPendentes e treinosConcluidos de todos os atletas
    await Athlete.updateMany(
      {}, // Aplica a todos os documentos
      {
        $pull: {
          treinosPendentes: treinoId,
          treinosConcluidos: treinoId,
        },
      }
    );

    console.log(`Treino com ID ${treinoId} deletado e removido de todos os atletas`);
    res.status(200).json({ message: 'Treino deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar treino:', error);
    res.status(500).json({ message: 'Erro ao deletar treino', error });
  }
};

