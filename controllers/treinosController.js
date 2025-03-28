const Treino = require('../models/Treinos');
const Athlete = require('../models/Athlete');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configuração do multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('fotoTreino');

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: 'df6jf1tux',
  api_key: '653415176186939',
  api_secret: 'yJrfipebj0AEn67wGvVIHW-4MCg',
});

// Função para upload da imagem
const uploadImageToCloudinary = (fileBuffer, filename) => {
  return new Promise((resolve, reject) => {
    console.log(`📤 Uploading image: ${filename} to Cloudinary...`);
    cloudinary.uploader.upload_stream(
      { folder: 'treinos', public_id: filename },
      (error, result) => {
        if (error) {
          console.error('❌ Erro no upload da imagem:', error);
          return reject(error);
        }
        console.log(`✅ Imagem enviada com sucesso: ${result.secure_url}`);
        resolve(result);
      }
    ).end(fileBuffer);
  });
};

// Criar treino
exports.criarTreino = async (req, res) => {
  console.log('🆕 Criando novo treino...');
  upload(req, res, async (err) => {
    if (err) {
      console.error('❌ Erro ao fazer upload da imagem:', err.message);
      return res.status(400).json({ success: false, message: 'Erro ao fazer upload da imagem', error: err.message });
    }

    try {
      let fotoUrl = null;
      if (req.file) {
        console.log(`📸 Imagem recebida: ${req.file.originalname}`);
        const result = await uploadImageToCloudinary(req.file.buffer, `${Date.now()}-${req.file.originalname}`);
        fotoUrl = result.secure_url;
      }

      const { fases, ...treinoData } = req.body;
      console.log(`📋 Dados do treino recebidos:`, treinoData);

      const novoTreino = await Treino.create({
        ...treinoData,
        fotoTreino: fotoUrl || req.body.fotoTreino,
        fases: fases ? JSON.parse(fases) : [],
      });
      console.log(`✅ Treino criado com ID: ${novoTreino._id}`);

      const atletasParaAtualizar = await Athlete.find({ nivel: { $gte: novoTreino.nivel } });
      if (!novoTreino.polo) {
        await Athlete.updateMany(
          { nivel: { $gte: novoTreino.nivel } },
          { $push: { treinosPendentes: novoTreino._id } }
        );
        console.log(`📢 Treino adicionado a ${atletasParaAtualizar.length} atletas pendentes.`);
      }

      res.status(201).json({ success: true, data: novoTreino, message: 'Treino criado com sucesso' });
    } catch (error) {
      console.error('❌ Erro ao criar treino:', error);
      res.status(400).json({ success: false, message: 'Erro ao criar treino', error: error.message });
    }
  });
};

// Buscar treinos com filtros
exports.buscarTreinos = async (req, res) => {
  console.log('🔍 Buscando treinos...');
  try {
    const treinos = await Treino.find(req.body);
    console.log(`✅ ${treinos.length} treinos encontrados`);
    res.status(200).json(treinos);
  } catch (error) {
    console.error('❌ Erro ao buscar treinos:', error);
    res.status(500).json({ message: 'Erro ao buscar os treinos', error });
  }
};

// Buscar um treino pelo ID
exports.buscarTreino = async (req, res) => {
  console.log('🔍 Buscando treino específico...');
  const { treinoId } = req.params;
  console.log(`📌 ID do treino: ${treinoId}`);
  try {
    const treino = await Treino.findById(treinoId);
    if (!treino) {
      console.warn('⚠️ Treino não encontrado');
      return res.status(404).json({ message: 'Treino não encontrado' });
    }
    console.log('✅ Treino encontrado:', treino);
    res.status(200).json(treino);
  } catch (error) {
    console.error('❌ Erro ao buscar treino:', error);
    res.status(500).json({ message: 'Erro ao buscar treino', error });
  }
};

// Deletar treino
exports.deletarTreino = async (req, res) => {
  console.log('🗑️ Deletando treino...');
  const { treinoId } = req.params;
  console.log(`📌 ID do treino: ${treinoId}`);
  try {
    const treinoDeletado = await Treino.findByIdAndDelete(treinoId);
    if (!treinoDeletado) {
      console.warn('⚠️ Treino não encontrado');
      return res.status(404).json({ message: 'Treino não encontrado' });
    }
    console.log('✅ Treino deletado com sucesso');
    await Athlete.updateMany({}, { $pull: { treinosPendentes: treinoId, treinosConcluidos: treinoId } });
    console.log('🧹 Treino removido dos atletas');
    res.status(200).json({ message: 'Treino deletado com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao deletar treino:', error);
    res.status(500).json({ message: 'Erro ao deletar treino', error });
  }
};
