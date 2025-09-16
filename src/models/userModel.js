import mongoose from 'mongoose';

const UserRankingSchema = new mongoose.Schema({
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
});

const athleteModel = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Nome é obrigatório'],
    },
    idade: {
        type: Number,
        required: [true, 'Idade é obrigatória'],
        min: [1, 'Idade deve ser maior que 0'], // Validação para garantir que a idade seja positiva
    },
    cpf: {
        type: String,
        required: [true, 'CPF é obrigatório'],
        unique: true, // Validação para garantir que o CPF seja único
        match: [/^\d{11}$/, 'Por favor, insira um CPF válido com 11 dígitos'], // Validação de formato de CPF
    },
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        unique: true, // Validação para garantir que o email seja único
        match: [/^\S+@\S+\.\S+$/, 'Por favor, insira um email válido'], // Validação de formato de email
    },
    dataNascimento: {
        type: Date,
        required: [true, 'Data de nascimento é obrigatória'],
    },
    telefone: {
        type: String,
        required: [true, 'Telefone é obrigatório'],
    },
    sexo: {
        type: String,
        required: [true, 'Sexo é obrigatório'],
        enum: ['Masculino', 'Feminino', 'Outro'], // Validação para garantir que sexo seja uma das opções
    },
    nivel: {
        type: Number,
        default: 1,
    },
    unidade: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: [false] // Adiciona a Referencia do Schema Unidade ao Schema de Atleta
    },
    turma: {
        type: mongoose.Schema.Types.ObjectId,  required: [false] // Adiciona a Referencia do Schema Turma ao Schema de Atleta
    },
    criadoEm: {
        type: Date,
        default: Date.now,
    },
    password: {  // Campo de senha
        type: String,
        required: true,
    },
    statusNivel: {
        type: String,
        enum: ['Aguardando Prova', 'Aprovado', 'Reprovado', 'Treinando'], default: 'Treinando'
    },
    role: {
        type: String,
        enum: ['ALUNO_MENSALISTA', 'ATLETA_FORA', 'PROFESSOR', 'ARBITRO', 'ADM'],
        default: 'ALUNO_MENSALISTA'
    },
    treinosPendentes: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'Treino' 
    }],
    treinosConcluidos: [{ 
        treinoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Treino', required: true },
        dataConclusao: { type: Date, default: Date.now },
    }],
    desafiosConcluidos: [{ 
        desafioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Treino', required: true },
        dataConclusao: { type: Date, default: Date.now },
    }],
    rankingCorrespondente: { type: mongoose.Schema.Types.ObjectId, ref: 'Ranking' },
    rankingDuplaCorrespondente: { type: mongoose.Schema.Types.ObjectId, ref: 'Ranking' },
    treinosFeitos: { type: Number, default: 0 },
    treinosTotais: { type: Number, default: 0 },
    progresso: { type: Number, default: 0 },
    fotoPerfil: { type: String },
    tokenVersion: { type: Number, default: 1 },
    status: {
        type: String,
        enum: ["pending", "active", "rejected"],
        default: "pending"
    },
    userRanking:{ type: [ UserRankingSchema ], required: true },
    activeDevices: [
        {
        deviceId: { type: String, required: true },
        refreshToken: { type: String },      // opcional
        createdAt: { type: Date, default: Date.now }
        }
    ]
});

const Athlete = mongoose.model('Athlete', athleteModel);

export default Athlete;

