import mongoose from 'mongoose';

const tips = new mongoose.Schema({
  videoUrl: { type: String, required: true },
  tipo: { type: String, enum: ['Técnica', 'Táctica', 'Visão']}
})

const faseModel = new mongoose.Schema({
  titulo: { type: String, required: true }, // Nome da fase
  descricao: { type: String, required: true }, // Explicação da fase
  videoUrl: { type: String }, // Opcional: link para vídeo da fase
  posicao: { type: Number, required: true }, // Posição da fase no treino
});

const nivelTreino = new mongoose.Schema({
  nivel: { type: String, required: true },
  fasesDoNivel: { type: [faseModel], required: true }, 
  descricao: { type: String, required: true }, 
  videoUrl: { type: String }, 
  duracao: { type: Number, required: true },
  objetivoTreino: {type: String},
  dicas: { type: [tips] }, // Lista de dicas para o nível
});

const treinoModel = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  videoUrl: { type: String },
  dataCriacao: { type: Date, default: Date.now },
  fotoTreino: {type: String},
  nivelTreino: { type: [nivelTreino], required: true },
});

const moduloTreinoModel = new mongoose.Schema({
  descricao: { type: String, required: true },
  tipo: { 
    type: String, 
    enum: ["forehand", "backhand", "movimentação"], 
    required: true 
  },
  Treinos: { type: [treinoModel], required: true },
  videoUrl: { type: String },
  dataCriacao: { type: Date, default: Date.now },
  fotoModulo: {type: String},
});

const Treino = mongoose.model("moduloTreino", moduloTreinoModel);

export default Treino;
