import Athlete from '../models/userModel.js';
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