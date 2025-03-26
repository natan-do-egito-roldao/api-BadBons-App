const mongoose = require('mongoose');

// Schema do jogador dentro do ranking
const playerSchema = new mongoose.Schema({
  athlete: { type: mongoose.Schema.Types.ObjectId, ref: 'Athlete', required: true },
  nome: { type: String, required: true },
  points: { type: Number, default: 5 },  // Pontuação do jogador
  wins: { type: Number, default: 0 },    // Número de vitórias
  losses: { type: Number, default: 0 },  // Número de derrotas
  gamesPlayed: { type: Number, default: 0 }, // Número de jogos jogados
  inChallenge: { type: Boolean, default: false }, // Indica se o jogador está em um desafio
  winnerResponse: { type: Boolean, default: null }, // Resposta do vencedor
  loserResponse: { type: Boolean, default: null }, // Resposta do perdedor
  rank: { type: Number, default: 0 }, // Posição do jogador no ranking, será calculada quando atualizado
  fotoPerfil: { type: String }
});

// Schema do ranking
const rankingSchema = new mongoose.Schema({
  category: { 
    type: String, 
    enum: ['Master 55+', 'Master 45+', 'Master 35+', 'Principal'], 
    required: true 
  },
  modality: { 
    type: String, 
    enum: ['SM', 'SF', 'DM', 'DF', 'DX'], 
    required: true 
  },
  players: [playerSchema],  // Lista de jogadores com pontuações
  status: { type: Boolean, default: true }
});

// Método para atualizar a classificação de um jogador dentro do ranking
rankingSchema.methods.updateRankings = async function() {
  // Ordenar os jogadores pela pontuação em ordem decrescente
  this.players.sort((a, b) => b.points - a.points);

  // Atualizar o rank de cada jogador
  this.players.forEach((player, index) => {
    player.rank = index + 1; // Rank começa de 1
  });

  // Salvar o ranking atualizado
  await this.save();
};

module.exports = mongoose.model('Ranking', rankingSchema);
