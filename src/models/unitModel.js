import mongoose from 'mongoose';

const planosSchema = new mongoose.Schema(
  {
    valor:   { type: Number, required: true }, 
    quantidadeDeAulas: { type: Number, required: true },
  },
  { _id: false }
);

const sessaoSchema = new mongoose.Schema(
  {
    diaSemana:   { type: Number, required: true },    // 0 (Dom) a 6 (Sáb)
    horaInicio:  { type: String, required: true },    // "19:00"
    duracaoMin:  { type: Number, default: 60 },       // duração em minutos
    tags: {type: [String]},
  },
  { _id: false }
);

const turmaSchema = new mongoose.Schema(
  {
    nome:        { type: String, required: true },    // “Intermediário A”
    sessoes:     { type: [sessaoSchema], required: true }, // Várias sessões por semana
    capacidade:  { type: Number, default: 16 }
  }
);

const unitSchema = new mongoose.Schema(
  {
    endereco:    { type: String, required: true },
    bairro:      { type: String, required: true },
    valorDiaria: { type: Number, required: true },
    turmas:      { type: [turmaSchema], default: [] },
    planos:     { type: [planosSchema], required: true }, // Várias sessões por semana
  },
  { timestamps: true }
);

const Unit = mongoose.model('Unit', unitSchema);
export default Unit;
