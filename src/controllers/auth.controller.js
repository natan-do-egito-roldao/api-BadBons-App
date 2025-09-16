import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import Treino from '../models/trainingModel.js';
import Unit from '../models/unitModel.js';
import jwt from 'jsonwebtoken'
import crypto from 'crypto';

export const createAthlete = async (req, res) => {
    try {
        console.log('cadastrando um novo atleta');
        const { nome, idade, email, cpf, dataNascimento, nivel, telefone, sexo, role, password, unidade, turma } = req.body;

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

        if (await User.findOne({ email })) {
            return res.status(400).json({ success: false, message: 'Email já cadastrado.' });
        }

        

        const treinos = await Treino.find({ nivel: { $lte: 1 } });

        //if (treinos.length === 0) {
        //    return res.status(404).json({ message: 'Nenhum treino encontrado.' });
        //}

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAthlete = await User.create({
            nome,
            idade,
            email,
            telefone,
            role,
            sexo,
            nivel,
            cpf,
            dataNascimento,
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

  const user = await User.findOne({ email })
  if ( user.status !== 'active') {
    return res.status(401).json({ error: 'Usuário pendente' })
  }
  const deviceId = crypto.randomUUID(); 

  const ok = await bcrypt.compare(password, user.password)
  if (!user || !ok) return res.status(402).json({ error: 'Credenciais inválidas' })

  const accessToken = jwt.sign(
    { sub: user._id, role: user.role, tv: user.tokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  )

    const refreshToken = jwt.sign(
    { sub: user._id, tv: user.tokenVersion, deviceId: deviceId },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  )

  const exists = User.activeDevices.some(d => d.deviceId === deviceId);

    if (!exists) {
        const newUser = await User.findByIdAndUpdate(
            user._id,
            { $push: { activeDevices: { deviceId, refreshToken } } },
            { new: true }
        );
        return newUser;
    }

    if (!newUser) {
        return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  res.json({ accesstoken: accessToken, refreshtoken: refreshToken, user: user })
}