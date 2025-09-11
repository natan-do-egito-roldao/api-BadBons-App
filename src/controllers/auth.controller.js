import bcrypt from 'bcryptjs';
import Athlete from '../models/userModel.js';
import Treino from '../models/trainingModel.js';
import Unit from '../models/unitModel.js';
import jwt from 'jsonwebtoken'

export const createAthlete = async (req, res) => {
    try {
        console.log('cadastrando um novo atleta');
        const { nome, idade, email, telefone, sexo, role, password, unidade, turma} = req.body;

        if (!unidade) {
            return res.status(400).json({ success: false, message: 'Unidade é obrigatória.' });
        }

        if (!turma) {
            return res.status(400).json({ success: false, message: 'Turma é obrigatória.' });
        }

        if (!(await Unit.findById(unidade))) {
            return res.status(400).json({ success: false, message: 'Unidade não encontrada.' });
        }

        const turma_id = await Unit.findOne({ 'turmas._id': turma });
        if (!turma_id) {
            return res.status(400).json({ success: false, message: 'Turma não encontrada.' });
        }

        if (!nome ) {
            return res.status(400).json({ success: false, message: 'Nome é obrigatório.' });
        }

        if (!password) {
            return res.status(400).json({ success: false, message: 'Senha é obrigatória.' });
        }

        if (await Athlete.findOne({ email })) {
            return res.status(400).json({ success: false, message: 'Email já cadastrado.' });
        }

        

        const treinos = await Treino.find({ nivel: { $lte: 1 } });

        //if (treinos.length === 0) {
        //    return res.status(404).json({ message: 'Nenhum treino encontrado.' });
        //}

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAthlete = await Athlete.create({
            nome,
            idade,
            email,
            telefone,
            role,
            sexo,
            password: hashedPassword,
            treinosPendentes: treinos.map(treino => treino._id),
            unidade: unidade,
            turma: turma,
        });

        res.status(201).json({
            message: 'Atleta criado com sucesso!',
            athlete: newAthlete,
        });
    } catch (err) {
        console.error('Erro ao criar atleta:', err.message);
        console.error('Stack:', err.stack);
        res.status(500).json({ message: 'Erro ao criar atleta.' });
    }
};

export const login = async (req, res) => {
  const { email, password } = req.body

  const user = await Athlete.findOne({ email })
  if ( user.status !== 'active')
    return res.status(401).json({ error: 'Usuário pendente' })

  const ok = await bcrypt.compare(password, user.password)
  if (!user || !ok) return res.status(402).json({ error: 'Credenciais inválidas' })

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  )

  res.json({ token, user: { 
    id: user._id, 
    name: user.name, 
    role: user.role,

 } })
}