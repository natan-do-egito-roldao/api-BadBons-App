import mongoose from 'mongoose';

const presencaSchema = new mongoose.Schema({
  unidadeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: true },
  turmaId:   { type: mongoose.Schema.Types.ObjectId, required: true }, // Agora temos ID da turma
  data:      { type: String, required: true },
  horaInicio: { type: String, required: true },

  alunos: [
    {
      aluno:         { type: String, required: true },
      marcouIda:       { type: Boolean, default: false },
      presente:        { type: Boolean, default: false }
    }
  ]
}, { timestamps: true });

const tagDaySchema = new mongoose.Schema({
  presencaSchema: [presencaSchema]
}, { timestamps: true });

export default mongoose.model("TagDay", tagDaySchema);