import User from '../models/userModel.js';
import Unit from '../models/unitModel.js';
import tagDaymodel from '../models/presenceModel.js';

export const getAllUnits = async (req, res) => {
    try {
        const units = await Unit.find();
        res.status(200).json({ success: true, data: units });
    } catch (error) {
        console.error('Erro ao buscar unidades:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar unidades' });
    }
}

export const getUnit = async (req, res) => {
    try {
        const userId = req.user.sub;

        const user = await User.findById(userId)

        const unit = await Unit.findById(user.unidade);

        res.status(200).json({ success: true, data: unit });
        
    } catch (error) {
        console.error('Erro ao buscar unidades:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar unidades' });
    }
}
 

export const tagDay = async (req, res) => {
  try {
    const diaSemana = req.body.diaSemana; // Espera-se que o dia da semana seja enviado no corpo da requisição
    const userId = req.user.sub;

    const user = await User.findById(userId);

    const unit = await Unit.findById(user.unidade);

    const turma = unit.turmas.find(t => t._id.equals(user.turma));
    if (!turma) {
      return res.status(404).json({ success: false, message: "Turma não encontrada na unidade" });
    }

    const turmaUser = turma.sessoes.find(t => t.diaSemana === Number(diaSemana));

    if (!turmaUser) {
      return res.status(404).json({ success: false, message: "Sessão não encontrada para o dia especificado" });
    }

    const newTagDay = await tagDaymodel.findOneAndUpdate(
      { "presencaSchema.data": diaSemana, "presencaSchema.horaInicio": turmaUser.horaInicio },
      { $push: { "presencaSchema.$[elem].alunos": { aluno: user.nome } } },
        {
          new: true,
          arrayFilters: [{ "elem.horaInicio": turmaUser.horaInicio }]
        }
    );

    res.status(200).json({ success: true, data: newTagDay });
  } catch (error) {
    console.error("Erro ao buscar unidades:", error);
    res.status(500).json({ success: false, message: "Erro ao buscar unidades" });
  }
};

export const viewTagDays = async (req, res) => {
  try {
    const diaSemana = req.body.diaSemana;
    const horaInicio = req.body.horaInicio;

    const tagDays = await tagDaymodel.find({
      "presencaSchema.data": diaSemana,
      "presencaSchema.horaInicio": horaInicio
    });

    const presencas = tagDays.flatMap(t =>
        t.presencaSchema.map(sessao => ({
            data: diaSemana,
            horaInicio: horaInicio,
            alunos: sessao.alunos
        }))
    );

    const presencasUnicas = presencas.filter((p, index, self) =>
        index === self.findIndex(
          t => diaSemana === t.data && horaInicio === t.horaInicio
        )
    );

    res.status(200).json({ success: true, data: presencasUnicas });

  } catch (error) {
    console.error("Erro ao buscar unidades:", error);
    res.status(500).json({ success: false, message: "Erro ao buscar unidades" });
  }
};
