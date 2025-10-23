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

    //constantes base para a rota
    const diaSemana = req.body.diaSemana;
    const userId = req.user.sub;
    const user = await User.findById(userId);
    const unit = await Unit.findById(user.unidade);
    const turma = unit.turmas.find(t => t._id.equals(user.turma));
    const tagToday = await tagDaymodel.find();
    const userName = user.nome;
    const horaInicio = req.body.horaInicio;

    if (!turma) {
      return res.status(404).json({ success: false, message: "Turma não encontrada na unidade" });
    }

    const turmaUser = turma.sessoes.flatMap(t => t.diaSemana);

    if (!turmaUser) {
      return res.status(404).json({ success: false, message: "Sessão não encontrada para o dia especificado" });
    }

    const enableDays = turmaUser.flatMap(t => t);
    let count = enableDays.length - 1;
    let quebra = false;

    while ( (!(enableDays[count] === Number(diaSemana))) || quebra === false ) {
      if (!(enableDays[count] === Number(diaSemana))){
        if (count === 0)
          return res.status(400).json({ success: false, message: "Dia não habilitado para marcação de presença" });
        count--;
      } else {
        quebra = true;
      }
    }

    const responsiveTag = tagToday.flatMap(t =>
      t.presencaSchema
      .filter(p => diaSemana === p.data && horaInicio === p.horaInicio)
      .map(p => ({
        horaInicio: horaInicio,
        alunos: p.alunos
      }))
    );

    if (responsiveTag.length < 1) {
      return res.status(404).json({ success: false, message: "Horário não encontrado para o dia especificado" });
    }

    const namesOnTag = responsiveTag.flatMap(t => t.alunos);

    const removeName = namesOnTag.filter((p, index, self) =>
      index === self.findIndex(
        t => t.aluno === userName
      )
    );

    if(removeName.length > 0){
      const removingName = await tagDaymodel.findOneAndUpdate(
        { "presencaSchema.data": diaSemana, "presencaSchema.horaInicio": horaInicio },
        { $pull: { "presencaSchema.$[elem].alunos": { aluno: user.nome } } },
        {
          new: true,
          arrayFilters: [{ "elem.horaInicio": horaInicio }]
        }
      );
      return res.status(200).json({ success: true, data: removingName });
    }

    const newTagDay = await tagDaymodel.findOneAndUpdate(
      { "presencaSchema.data": diaSemana, "presencaSchema.horaInicio": horaInicio },
      { $push: { "presencaSchema.$[elem].alunos": { aluno: user.nome, marcouIda: true } } },
        {
          new: true,
          arrayFilters: [{ "elem.horaInicio": horaInicio }]
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

export const confirmPresence = async (req, res) => {
  try{
    const aluno = req.body.aluno;
    const data = req.body.data;
    const horaInicio = req.body.horaInicio;
    const presente = req.body.marcouIda;

    const updatedTag = await tagDaymodel.findOneAndUpdate(
      { "presencaSchema.data": data, "presencaSchema.horaInicio": horaInicio, "presencaSchema.alunos.aluno": aluno },
      { $push: { "presencaSchema.$[elem].alunos": { presente: presente } } },
      {
        new: true,
        arrayFilters: [{ "elem.horaInicio": horaInicio }]
      }
    );

    res.status(200).json({ success: true, data: updatedTag });

  } catch (error){
    res.status(500).json({ success: false, message: "Erro ao confirmar presença" });
  }
}