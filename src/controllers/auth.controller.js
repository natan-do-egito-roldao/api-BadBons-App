import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import Treino from '../models/trainingModel.js';
import Unit from '../models/unitModel.js';
import jwt from 'jsonwebtoken'
import crypto from 'crypto';
import { error } from 'console';

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

export const logout = async (req,res) => {
    const auth = req.body.refreshToken || ''

    if (!auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'token ausente ou mal formatado'})
    }

    const refreshToken = auth.slice(7).trim();
    if (!await User.findOne({ "activeDevices.refreshToken": refreshToken })) {
        res.status(402).json({error:" Token não associado a algum dispositivo com está conta"})
    }

    let payload;
    try {
        payload = jwt.verify(refreshToken, process.env.JWT_SECRET)
    }catch (err) {
        return res.status(403).json({ error: 'Refresh token inválido' });
    }
    
    const { sub: userId, deviceId } = payload;

    const user = await User.findByIdAndUpdate(
        userId,
        {$pull: {activeDevices: { deviceId }}},
        { new: true }
    );

    if(!user) {
        res.statu(404).json({ error: `usuario não encontrado` });    
    }
    res.status(200).json({ message: `usuario deslogado com sucesso`, dispositivosAtivos: user.activeDevices });

}

export const loginToken = async (req,res) => {
    const tokenUser = req.user.deviceId;

    if (!tokenUser) {
        return res.sendStatus(400)
    }

    if (tokenUser) {
        return res.sendStatus(200)
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if ( user.status !== 'active') {
        return res.sendStatus(401)
    }
    const deviceId = crypto.randomUUID(); 

    const ok = await bcrypt.compare(password, user.password)
    if (!user || !ok) return res.sendStatus(402)

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
    
    let newUser;

    if (user.activeDevices) {
        newUser = await User.findByIdAndUpdate(
        user._id,
        //{ $push: { activeDevices: { deviceId, refreshToken } } },
        { new: true }
        );
    } else {
        return res.sendStatus(403);
    }

    const userSafe = Object.assing({}, newUser);

    return res.json({
      accesstoken: accessToken,
      user: newUser
    });
}