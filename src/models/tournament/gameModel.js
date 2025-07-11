// models/Partida.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const atletaSchema = new Schema({
  atletaId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  nome:     { type: String }, 
});

const partidaSchema = new Schema({
  torneioId:     { type: Schema.Types.ObjectId, ref: 'Torneio', required: true },
  rodada:        { type: Number }, 
  dataHora:      { type: Date },
  quadra:        { type: String }, 
  modalidade:    { type: String, enum: ['sm', 'sf', 'dm', 'df', 'dx'], required: true },
  categoria:     { type: String, enum: ['principal', '35+', '45+', '55+'], required: true },

  // atletas ou duplas
  ladoA:         [{ type: atletaSchema, required: true }], 
  ladoB:         [{ type: atletaSchema, required: true }],

  vencedor:      { type: String, enum: ['A', 'B', 'empate', 'pulado'], required: true },
  placar:        { type: String }, 

  status:        { type: String, enum: ['confirmando', 'em_andamento', 'concluido'], default: 'confirmando' },
}, { timestamps: true });

module.exports = mongoose.model('Partida', partidaSchema);
