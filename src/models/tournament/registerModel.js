const mongoose = require('mongoose');
const { Schema } = mongoose;

const inscricaoSchema = new Schema({
  torneio:     { type: Schema.Types.ObjectId, ref: 'Torneio' },
  atletas:     [{ type: Schema.Types.ObjectId, ref: 'User' }], // 1 (simples) ou 2 (dupla)
  categoria:   { type: String },
  modalidade:  { type: String, enum: ['sm', 'dm', 'sf', 'df', 'dx'], required: true },
  status:      { type: String, enum: ['confirmado', 'pendente'], default: 'pendente' }
});

module.exports = mongoose.model('Inscricao', inscricaoSchema);