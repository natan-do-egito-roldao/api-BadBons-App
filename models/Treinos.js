const mongoose = require("mongoose");

const faseSchema = new mongoose.Schema({
  titulo: { type: String, required: true }, // Nome da fase
  descricao: { type: String, required: true }, // Explicação da fase
  videoUrl: { type: String } // Opcional: link para vídeo da fase
});

const treinoSchema = new mongoose.Schema({
  nome: { type: String, required: true }, // Nome do treino
  descricao: { type: String, required: true }, // Breve descrição do treino
  nivel: { type: Number, required: true }, // Nível do treino
  duracao: { type: Number, required: true }, // Duração do treino em minutos
  fases: { type: [faseSchema], required: true }, // Array de fases do treino
  tipo: { 
    type: String, 
    enum: ["ataque", "defesa", "dupla", "movimentação"], 
    required: true 
  }, // Tipo de treino
  videoUrl: { type: String }, // Opcional: link para vídeo explicativo geral do treino
  dataCriacao: { type: Date, default: Date.now }, // Data de criação
  polo: {type: Boolean, required: true}, // Nome do polo
  fotoTreino: {type: String},
  objetivoTreino: {type: String}
});

module.exports = mongoose.model("Treino", treinoSchema);
