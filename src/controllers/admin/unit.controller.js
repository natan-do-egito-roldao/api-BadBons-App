import Unit from '../../models/unitModel.js';
import tagDay from '../../models/presenceModel.js'

export const createUnit = async (req, res) => {
    console.log('cadastrando uma nova unidade');
    try {
        const { endereco, bairro, valorDiaria, turmas, planos } = req.body;

        if (await Unit.findOne({ endereco })) {
            return res.status(400).json({ success: false, message: 'Unidade já cadastrada com este endereço.' });
        }
        if (!endereco) {
            return res.status(400).json({ success: false, message: 'Endereço é obrigatório.' });
        }
        if (!bairro) {
            return res.status(400).json({ success: false, message: 'Bairro é obrigatório.' });
        }
        if (!valorDiaria || isNaN(valorDiaria)) {
            return res.status(400).json({ success: false, message: 'Valor diário é obrigatório e deve ser um número.' });
        }
        if (!Array.isArray(turmas)) {
            return res.status(400).json({ success: false, message: 'Turmas devem ser um array.' });
        }
        if (!Array.isArray(planos)) {
            return res.status(400).json({ success: false, message: 'Planos devem ser um array.' });
        }

        const newUnit = await Unit.create({
            endereco,
            bairro,
            valorDiaria,
            turmas: turmas.map(turma => ({
                nome: turma.nome,
                diasSemana: turma.diasSemana,
                horaInicio: turma.horaInicio,
                duracaoMin: turma.duracaoMin || 60, // valor padrão
                capacidade: turma.capacidade || 16, // valor padrão
                sessoes: turma.sessoes.map(sessao => ({
                    diaSemana: sessao.diaSemana,
                    horaInicio: sessao.horaInicio,
                    duracaoMin: sessao.duracaoMin || 60,
                }))
            })),
            planos: planos.map(plano => ({
                valor: plano.valor,
                quantidadeDeAulas: plano.quantidadeDeAulas,
            })),
            
        });
        const presencas = newUnit.turmas.flatMap(turma =>
            turma.sessoes.map(sessao => ({
                unidadeId: newUnit._id,
                turmaId: turma._id,
                data: sessao.diaSemana,
                horaInicio: sessao.horaInicio,
            }))
        );

        const presencasUnicas = presencas.filter((p, index, self) =>
            index === self.findIndex(
                t => t.data === p.data && t.horaInicio === p.horaInicio
            )
        );

        const newTagDay = await tagDay.create({ presencaSchema: presencasUnicas });

        return res.status(201).json({ success: true, data: newUnit, tag: newTagDay });
    } catch (error) {
        console.error('Erro ao cadastrar unidade:', error);
        return res.status(500).json({ success: false, message: 'Erro ao cadastrar unidade.' });
    }
}