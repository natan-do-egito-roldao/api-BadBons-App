import mongoose from 'mongoose';

const presencaSchema = new mongoose.Schema({
  unidadeId: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
  turmaId:   { type: Schema.Types.ObjectId, required: true }, // Agora temos ID da turma
  data:      { type: Date, required: true },
  horaInicio: { type: String, required: true },

  alunos: [
    {
      alunoId:         { type: Schema.Types.ObjectId, ref: 'User', required: true },
      marcouIda:       { type: Boolean, default: false },
      horaMarcacao:    { type: String },
      presente:        { type: Boolean, default: false },
      horaConfirmacao: { type: String },
      observacao:      { type: String }
    }
  ]
}, { timestamps: true });


export default mongoose.model('Presenca', presencaSchema);