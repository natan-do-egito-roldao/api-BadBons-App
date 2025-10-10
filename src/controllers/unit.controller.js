import User from '../models/userModel.js';
import Unit from '../models/unitModel.js';

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


export const tagDay = async (req,res) => {
    try {
        console.log("awqerefd")
        const now = new Date();
        const userID = req.user.sub;

        const formatoSP = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        dateStyle: 'full',
        timeStyle: 'long',
        });

        const user = await User.findById(userID)

        const turmaUser = user.turma;
        console.log(turmaUser)

        const unit = await Unit.findById(user.unidade);
        res.status(200).json({ success: true, data: unit });



    } catch (error) {
        console.error('Erro ao buscar unidades:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar unidades' });

    }
}