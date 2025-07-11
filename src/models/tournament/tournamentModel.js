const mongoose = require('mongoose');
const { Schema } = mongoose;

const torneioSchema = new Schema({
  nome:        { type: String, required: true },
  descricao:   { type: String },
  dataInicio:  { type: Date, required: true },
  dataFim:     { type: Date, required: true },
  quadras:     { type: Number, required: true }, // total de quadras disponíveis
  local:       { type: String }, // ex: nome da unidade ou ginásio

  categorias: [{
    nome:         { type: String, required: true }, // ex: "35+", "Principal"
    modalidades: [{
      tipo:       { type: String, enum: ['sm', 'dm', 'sf', 'df', 'dx'], required: true },
      inscritos:  [{ type: Schema.Types.ObjectId, ref: 'Inscricao' }], // Inscrição pode conter 1 ou 2 atletas
      chaves:     [{ type: Schema.Types.ObjectId, ref: 'Chave' }], // Ex: grupos, eliminatórias, etc
    }]
  }],

  organizador:  { type: Schema.Types.ObjectId, ref: 'User' }, // Admin ou professor
  status:       { type: String, enum: ['planejado', 'em-andamento', 'finalizado'], default: 'planejado' },

  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Torneio', torneioSchema);
