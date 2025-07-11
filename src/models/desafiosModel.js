const mongoose = require("mongoose");

const faseModel = new mongoose.Schema({
  titulo: { type: String, required: true }, // Nome da fase
  descricao: { type: String, required: true }, // Explicação da fase
  videoUrl: { type: String }, // Opcional: link para vídeo da fase
  posicao: { type: Number, required: true }, // Posição da fase no treino
});

const desafioSchema = new mongoose.Schema({
  nome: { type: String, required: true }, // Nome do treino
  descricao: { type: String, required: true }, // Breve descrição do treino
  nivel: { 
    type: Number, 
    required: true 
  }, // Nível do treino
  duracao: { type: Number, required: true }, // Duração em minutos
  tipo: { 
    type: String, 
    enum: ["ataque", "defesa", "dupla", "movimentação"], 
    required: true 
  }, // Tipo de treino
  imagem: { type: String },
  videoUrl: { type: String }, // Opcional: link para vídeo explicativo
  dataCriacao: { type: Date, default: Date.now }, // Campo de status booleano
  quantidadeConclusao: { type: Number, default: 0 }, // Adicionando o campo // Data de criação
  fasesDoNivel: { type: [faseModel], required: true },
});

module.exports = mongoose.model("desafio", desafioSchema);
