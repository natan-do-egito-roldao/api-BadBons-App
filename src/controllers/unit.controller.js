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