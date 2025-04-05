// routes/ranking.js
const express = require('express');
const Ranking = require('../models/RankingSchema'); // Importar o modelo de Ranking
const router = express.Router();
const Athlete = require('../models/Athlete');
const Configuracao = require('../models/Configuracao');
const mongoose = require('mongoose');
const verifyAdminToken = require('../middleware/adminAuthMiddlewareHeader');

router.get('/buscar-atleta', async (req, res) => {
  try {
    const { nome } = req.query;
    console.log('Nome recebido da requisição:', nome);

    if (!nome || typeof nome !== 'string') {
      return res.status(400).json({ message: "O nome do atleta é obrigatório e deve ser uma string." });
    }

    // Crie a expressão regular e log
    const nomeRegex = new RegExp(`^${nome.trim()}`, 'i');
    console.log('Expressão regular gerada:', nomeRegex);

    console.log('Consultando o banco com a expressão regular:', nomeRegex);
    const atletas = await Ranking.find({
      "players.athlete.nome": nomeRegex
    }).populate("players.athlete", "nome");

    console.log('Atletas encontrados no banco:', atletas);

    if (!atletas.length) {
      return res.status(404).json({ message: "Nenhum atleta encontrado." });
    }

    // Filtro aplicado e log
    const atletasFormatados = atletas.flatMap(ranking =>
      ranking.players
        .filter(player => nomeRegex.test(player.athlete.nome)) // Filtro com .test()
        .map(player => ({
          id: player.athlete._id,
          nome: player.athlete.nome,
          ranking: ranking.category
        }))
    );

    console.log('Atletas formatados após o filtro:', atletasFormatados);

    res.json({ atletas: atletasFormatados });
  } catch (error) {
    console.error("Erro ao buscar atleta:", error);
    res.status(500).json({ message: "Erro ao buscar atleta.", error });
  }
});

router.get('/buscar-ranking-id', async (req, res) => {
  try {
    const { rankingId } = req.query;  // ID do ranking enviado como parâmetro de consulta

    console.log('ID do ranking recebido da requisição:', rankingId);

    if (!rankingId || typeof rankingId !== 'string') {
      return res.status(400).json({ message: "O ID do ranking é obrigatório e deve ser uma string." });
    }

    // Buscar o ranking no banco de dados pelo ID
    const ranking = await Ranking.findById(rankingId).populate('players.athlete', 'nome');

    console.log('Ranking encontrado no banco:', ranking);

    if (!ranking) {
      return res.status(404).json({ message: "Ranking não encontrado." });
    }
    console.log(ranking);
    // Formatar os jogadores dentro do ranking
    const jogadoresFormatados = ranking.players.map(player => ({
      nome: player.nome,
      pontos: player.points,  // Supondo que você queira os pontos do jogador também
      rank: player.rank,  // Se houver um campo 'rank'
      exatoRanking: ranking
    }));

    console.log('Jogadores do ranking formatados:', jogadoresFormatados);

    res.json({ players: jogadoresFormatados });
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    res.status(500).json({ message: "Erro ao buscar ranking.", error });
  }
});



// Rota para buscar um ranking específico e um atleta dentro dele
router.get('/buscar-ranking-atleta', async (req, res) => {
  try {
    const { category, modality, athleteId } = req.query;

    // Verificar se os parâmetros foram fornecidos
    if (!category || !modality || !athleteId) {
      return res.status(400).json({ message: 'Categoria, modalidade e ID do atleta são obrigatórios.' });
    }

    // Buscar o ranking correspondente
    const ranking = await Ranking.findOne({ category, modality }).populate('players.athlete', 'nome');

    if (!ranking) {
      return res.status(404).json({ message: 'Ranking não encontrado.' });
    }

    // Buscar o atleta dentro do ranking
    const player = ranking.players.find(player => player.athlete._id.toString() === athleteId);

    if (!player) {
      return res.status(404).json({ message: 'Atleta não encontrado no ranking.' });
    }

    res.json({
      message: 'Ranking e atleta encontrados com sucesso.',
      ranking: {
        category: ranking.category,
        modality: ranking.modality,
      },
      player: {
        nome: player.nome,
        points: player.points,
        wins: player.wins,
        losses: player.losses,
        gamesPlayed: player.gamesPlayed,
        rank: player.rank,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar ranking e atleta:', error);
    res.status(500).json({ message: 'Erro ao buscar ranking e atleta.', error });
  }
});


// Rota para obter todos os rankings com jogadores
router.get('/obter-rankings', async (req, res) => {
  try {
    // Pegando os parâmetros de categoria e modalidade da requisição
    const { category, modality } = req.query;

    // Construindo o filtro dinamicamente
    const filter = {};
    if (category) filter.category = category;
    if (modality) filter.modality = modality;

    // Encontrar rankings com base no filtro
    const rankings = await Ranking.find(filter)
      .populate('players.athlete', 'nome') // Popula o nome do atleta
      .sort({ category: 1, modality: 1 }); // Ordena por categoria e modalidade, se necessário
    
    if (!rankings || rankings.length === 0) {
      return res.status(404).json({ message: 'Nenhum ranking encontrado para os critérios fornecidos.' });
    }
    rankings.forEach(rankings => {
      console.log('RANKING: ', rankings, rankings._id);
    });
    console.log('ERROR APARTIR DAQUI?')
    // Resposta com rankings filtrados
    res.json({
      message: 'Rankings encontrados com sucesso.',
      rankings: rankings.map(ranking => ({
        category: ranking.category,
        modality: ranking.modality,
        _id: ranking._id.toString(),
        players: ranking.players.map(player => ({
          nome: player.nome,
          points: player.points,
          wins: player.wins,
          losses: player.losses,
          gamesPlayed: player.gamesPlayed,
          rank: player.rank,
          _id: player.athlete,
          fotoPerfil: player.fotoPerfil
        }))
      }))
    });
  } catch (error) {
    console.error('Erro ao obter rankings:', error);
    res.status(500).json({ message: 'Erro ao obter rankings.', error });
  }
});


// 2. Rota para cadastrar um jogador em um ranking
router.post('/adicionar-atleta', async (req, res) => {
  try {
    const { category, modality, athleteId } = req.body;
    console.log('Dados recebidos:', { category, modality, athleteId });

    // Encontrar o ranking correspondente
    const ranking = await Ranking.findOne({ category, modality });
    if (!ranking) {
      console.log('Ranking não encontrado.');
      return res.status(404).json({ message: 'Ranking não encontrado.' });
    }
    console.log('Ranking encontrado:', ranking);

    // Encontrar o atleta correspondente
    const athlete = await Athlete.findById(athleteId);
    if (!athlete) {
      console.log('Atleta não encontrado.');
      return res.status(404).json({ message: 'Atleta não encontrado.' });
    }
    console.log('Atleta encontrado:', athlete);

    // Verificar se o jogador já está no ranking
    const existingPlayer = ranking.players.find(player => player.athlete && player.athlete.toString() === athleteId);
    if (existingPlayer) {
      console.log('Jogador já cadastrado no ranking.');
      return res.status(400).json({ message: 'Jogador já cadastrado no ranking.' });
    }

    // Verificar a idade do jogador em relação à categoria
    const ageLimits = {
      'Master 55+': 55,
      'Master 45+': 45,
      'Master 35+': 35,
      'Principal': 0
    };
    if (athlete.idade < ageLimits[category]) {
      console.log(`Jogador não pode se cadastrar na categoria ${category} devido à idade.`);
      return res.status(400).json({ message: `Jogador não pode se cadastrar na categoria ${category} devido à idade.` });
    }

    // Verificar a modalidade e o sexo do jogador
    const modalitySexRestrictions = {
      'SM': 'Masculino',
      'SF': 'Feminino',
      'DM': 'Masculino',
      'DF': 'Feminino',
      'DX': 'MF'
    };
    const allowedSex = modalitySexRestrictions[modality];
    console.log(`Verificando sexo: athlete.sexo=${athlete.sexo}, allowedSex=${allowedSex}`);
    if (allowedSex !== 'MF' && athlete.sexo !== allowedSex) {
      console.log(`Jogador não pode se cadastrar na modalidade ${modality} devido ao sexo. ${athlete.sexo}`);
      return res.status(400).json({ message: `Jogador não pode se cadastrar na modalidade ${modality} devido ao sexo.` });
    }

    // Adicionar jogador
    const athleteObjectId = new mongoose.Types.ObjectId(athleteId);
    console.log(`Adicionando jogador com athleteObjectId=${athleteObjectId}`);
    ranking.players.push({ 
      athlete: athleteObjectId,
      nome: athlete.nome,
      fotoPerfil: athlete.fotoPerfil
    });
    console.log(ranking.players);
    try {
      await ranking.save();
      console.log('Jogador adicionado ao ranking.');
    } catch (saveError) {
      console.error('Erro ao salvar o ranking:', saveError);
      return res.status(500).json({ message: 'Erro ao salvar o ranking.', error: saveError });
    }

    // Popular o ranking com os dados do schema Athlete
    await ranking.populate('players.athlete', 'nome id');
    console.log('Ranking populado com os dados do atleta.');

    // adiciona id do ranking a variavel ranking correspondente no schema de athlete
    if (allowedSex !== 'MF') {
      athlete.rankingCorrespondente = ranking._id;
      await athlete.save();
    } else {
      athlete.rankingDuplaCorrespondente = ranking._id;
      await athlete.save();
    }

    res.status(201).json({ message: 'Jogador adicionado ao ranking com sucesso!', ranking });
  } catch (error) {
    console.error('Erro ao adicionar jogador:', error);
    res.status(500).json({ message: 'Erro ao adicionar jogador.', error });
  }
});

// 3. Rota para desafiar adversários aleatórios
router.post('/desafiar', async (req, res) => {
  try {
    const { category, modality, athleteId } = req.body;

    // Encontrar o ranking correspondente
    const ranking = await Ranking.findOne({ category, modality }).populate('players.athlete', 'nome');
    if (!ranking) return res.status(404).json({ message: 'Ranking não encontrado.' });

    // Encontrar o desafiador
    const challenger = ranking.players.find(player => player.athlete._id.toString() === athleteId);
    if (!challenger) return res.status(404).json({ message: 'Desafiador não encontrado no ranking.' });

    // Verificar se o desafiador já está em um desafio
    if (challenger.inChallenge) {
      return res.status(400).json({ message: 'Você já está em um desafio.' });
    }

    // Selecionar adversário aleatório (diferente do desafiador, que não esteja em um desafio e que não seja o último oponente)
    const opponents = ranking.players.filter(player => 
      player.athlete._id.toString() !== athleteId && 
      !player.inChallenge && 
      player.nome !== challenger.lastOpponent
    );
    if (opponents.length === 0) return res.status(400).json({ message: 'Sem adversários disponíveis.' });

    const randomOpponent = opponents[Math.floor(Math.random() * opponents.length)];

    // Marcar ambos como em desafio
    challenger.inChallenge = true;
    randomOpponent.inChallenge = true;
    await ranking.save();

    res.json({
      message: 'Desafio iniciado.',
      challenger: challenger.nome,
      opponent: randomOpponent.athlete.nome,
    });
  } catch (error) {
    console.error('Erro ao iniciar o desafio:', error);
    res.status(500).json({ message: 'Erro ao iniciar o desafio.', error });
  }
});

// 4. Rota para concluir desafio e atualizar pontos
router.post('/concluir-desafio', async (req, res) => {
  try {
    const { category, modality, athleteId, winnerName, loserName } = req.body;

    // Encontrar o ranking correspondente
    const ranking = await Ranking.findOne({ category, modality });
    if (!ranking) return res.status(404).json({ message: 'Ranking não encontrado.' });

    // Encontrar o jogador correspondente
    const player = ranking.players.find(player => player.athlete._id.toString() === athleteId);
    if (!player) return res.status(404).json({ message: 'Jogador não encontrado no ranking.' });

    // Atualizar a resposta do jogador
    if (player.nome === winnerName) {
      player.winnerResponse = true;
      player.loserResponse = false;
    } else if (player.nome === loserName) {
      player.loserResponse = true;
      player.winnerResponse = false;
    } else {
      return res.status(400).json({ message: 'Nome do jogador não corresponde ao vencedor ou perdedor.' });
    }

    // Verificar se ambos os jogadores responderam
    const opponent = ranking.players.find(p => p.athlete._id.toString() !== athleteId && p.inChallenge);
    if (!opponent) return res.status(404).json({ message: 'Adversário não encontrado no ranking.' });

    // Verificar se ambos os jogadores responderam e se as respostas coincidem
    if (player.winnerResponse !== null && opponent.winnerResponse !== null) {
      if (player.winnerResponse && opponent.loserResponse) {
        // Atualizar pontuações
        player.points += 2;
        opponent.points -= 2;
        player.inChallenge = false;
        opponent.inChallenge = false;
        player.winnerResponse = null;
        opponent.loserResponse = null;
        player.lastOpponent = opponent.nome;
        opponent.lastOpponent = player.nome;
        await ranking.save();
        return res.json({ message: 'Desafio concluído com sucesso.', updatedRanking: ranking });
      } else if (player.loserResponse && opponent.winnerResponse) {
        // Atualizar pontuações
        opponent.points += 2;
        player.points -= 2;
        player.inChallenge = false;
        opponent.inChallenge = false;
        player.loserResponse = null;
        opponent.winnerResponse = null;
        player.lastOpponent = opponent.nome;
        opponent.lastOpponent = player.nome;
        await ranking.save();
        return res.json({ message: 'Desafio concluído com sucesso.', updatedRanking: ranking });
      } else {
        // Resetar respostas se não houver concordância
        player.winnerResponse = null;
        player.loserResponse = null;
        opponent.winnerResponse = null;
        opponent.loserResponse = null;
        return res.status(400).json({ message: 'As respostas não coincidem. Por favor, tente novamente.' });
      }
    }

    await ranking.save();
    res.json({ message: 'Resposta registrada. Aguardando resposta do adversário.' });
  } catch (error) {
    console.error('Erro ao concluir o desafio:', error);
    res.status(500).json({ message: 'Erro ao concluir o desafio.', error });
  }
});

// adicionando necessidade de token para acessar as rotas
router.use(verifyAdminToken);

// Rota para excluir um atleta do ranking
router.delete("/:rankingId/deletar-atleta/:athleteId", async (req, res) => {
  try {
    const { rankingId, athleteId } = req.params;
    console.log('Dados recebidos:', { rankingId, athleteId });

    // Encontrar o ranking pelo ID
    let ranking = await Ranking.findById(rankingId);
    if (!ranking) {
      return res.status(404).json({ message: "Ranking não encontrado" });
    }

    // Verificar se a propriedade players existe e é um array
    if (!Array.isArray(ranking.players)) {
      ranking.players = []; // Inicializa como um array vazio se não for um array válido
    }

    // Remover o atleta do array de atletas do ranking
    ranking.players = ranking.players.filter(athlete => {
      console.log('Comparando:', athlete.athlete.toString(), athleteId);
      // Se o atleta é um ObjectId, compare diretamente sem usar toString()
      return athlete.athlete.toString() !== athleteId;

    });
    console.log(ranking.players)

    // Salvar o ranking atualizado
    await ranking.save();

    res.status(200).json({ message: "Atleta removido do ranking com sucesso" });
    console.log('Atleta removido do ranking com sucesso');
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover atleta do ranking", error: error.message });
    console.log('Erro ao remover atleta do ranking:', error);
  }
});


// 1. Rota para criar um novo ranking
router.post('/criar', async (req, res) => {
  try {
    const { category, modality } = req.body;

    // Criar um novo ranking
    const ranking = new Ranking({ category, modality });
    await ranking.save();

    res.status(201).json({ message: 'Ranking criado com sucesso!', ranking });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar o ranking.', error });
  }
});

// 5. Atualiza o dia de reinício do ranking
router.post('/configurar-ranking', async (req, res) => {
  try {
    const { dia } = req.body;

    if (dia < 1 || dia > 31) {
      return res.status(400).json({ success: false, message: 'O dia deve estar entre 1 e 31.' });
    }

    // Atualiza ou cria a configuração no banco de dados
    const configuracao = await Configuracao.findOneAndUpdate(
      { chave: 'rankingDia' },
      { valor: dia },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, message: 'Dia de reinício configurado com sucesso!', configuracao });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao configurar o dia de reinício.', error: error.message });
  }
});

// 6. rota para ativar e desativar a rota de desafiar atleta
router.patch('/atualiza-status', async (req, res) => {
  try {
      const { rankingId, status } = req.body;

      const ranking = await Ranking.findById(rankingId);
      if (!ranking) {
          return res.status(404).json({ success: false, message: ' ranking não encontrado'});
      }

      ranking.status = status;
      await ranking. save();
      res.status(200).json({ success: true, message: `Ranking ${status ? 'ativado' : 'desativado'} com sucesso`});
  } catch (error) {
      res.status(500).json({ success: false, message: 'error ao atualizar status do ranking', error: error.message});
  }
});

// Rota para atualizar a pontuação de um jogador e recalcular o ranking
router.put('/atualizar-pontos/:athleteId', async (req, res) => {
  try {
    const { athleteId } = req.params;
    const { category, modality, pontosAdicionados } = req.body;

    // Converter pontosAdicionados para número inteiro
    const pontos = parseInt(pontosAdicionados, 10);
    if (isNaN(pontos)) {
      return res.status(400).json({ message: 'Valor de pontosAdicionados inválido. Deve ser um número.' });
    }

    // Encontrar o ranking correspondente
    const ranking = await Ranking.findOne({ category, modality });
    if (!ranking) {
      return res.status(404).json({ message: 'Ranking não encontrado.' });
    }

    // Encontrar o jogador no ranking
    const playerIndex = ranking.players.findIndex(player => player.athlete.toString() === athleteId);
    if (playerIndex === -1) {
      return res.status(404).json({ message: 'Jogador não encontrado no ranking.' });
    }

    // Atualizar a pontuação do jogador
    ranking.players[playerIndex].points += pontos;

    // Salvar a atualização no banco
    await ranking.save();

    // Recalcular o ranking
    await ranking.updateRankings();

    // Obter o novo lugar do jogador após recalcular o ranking
    const updatedPlayer = ranking.players.find(player => player.athlete.toString() === athleteId);

    res.json({
      message: 'Pontuação atualizada com sucesso.',
      updatedPlayer: {
        nome: updatedPlayer.nome,
        pontos: updatedPlayer.points,
        rank: updatedPlayer.rank, // Retorna o novo ranking atualizado
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar a pontuação:', error);
    res.status(500).json({ message: 'Erro ao atualizar a pontuação do jogador.', error });
  }
});


// Rota para deletar um ranking específico
router.delete('/deletar-ranking', async (req, res) => {
  try {
    const { category, modality } = req.body;

    // Verificar se os parâmetros foram fornecidos
    if (!category || !modality) {
      return res.status(400).json({ message: 'Categoria e modalidade são obrigatórias.' });
    }

    // Encontrar e deletar o ranking correspondente
    const ranking = await Ranking.findOneAndDelete({ category, modality });

    if (!ranking) {
      return res.status(404).json({ message: 'Ranking não encontrado.' });
    }

    res.json({ message: 'Ranking deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar o ranking:', error);
    res.status(500).json({ message: 'Erro ao deletar o ranking.', error });
  }
});

module.exports = router;
