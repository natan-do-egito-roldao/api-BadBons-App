const schedule = require('node-schedule');
const Ranking = require('./models/RankingSchema');
const Configuracao = require('./models/Configuracao');

// função para reiniciar rankings
const reiniciarRankings = async () => {
    console.log('Iniciando reinício dos rankings...');
    try{
        const rankings = await Ranking.findById();

        for (const ranking of rankings) {
            ranking.alunos.forEach(aluno => {
                aluno.pontos = 5; // reinicia os pontos
            });
            await ranking.save();
        }

        console.log('Ranking reiciado com sucesso!');
    } catch (error) {
        console.error('Erro ao reiniciar rankings:', error.message);
      }
};

// job dinamico para reiniciar rankings
const iniciarScheduler = async () => {
    try {
        //obtem o dia configurado no banco de dados
        const configuracao = await Configuracao.findOne({ chave: 'rankingDia'});
        const dia = configuracao?.valor || 1; // usa o dia 1 como padrão

        // Agendamento dinamico
        schedule.scheduleJob(`0 0 ${dia} */3*`, reiniciarRankings);
        console.log(`Scheduler configurado para o dia ${dia} de cada trimestre.`);
  } catch (error) {
    console.error('Erro ao configurar o scheduler:', error.message);
  }
};

module.exports = iniciarScheduler;