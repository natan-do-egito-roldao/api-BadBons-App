import User from '../../models/userModel.js';
import bcrypt from 'bcryptjs';
export async function alterInfo(req,res) {
    try{
        const data = req.user;

        if (Object.keys(data).length === 0) {
            return res.status(400).json({ error: 'Nenhum dado fornecido para alteração' });
        }

        const allowedFields = ['nome', 'email', 'telefone', 'password'];
        const alterData = {};
        
        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
                alterData[field] = data[field];
            }
        });

        if (alterData.includes('password')) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(alterData.password, salt);
            alterData.password = hashedPassword;
            alterData.tokenVersion += 1;
        }

        const newUser = await User.findByIdAndUpdate(data.sub, alterData, { new: true });

        if (!newUser) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json({ message: `usuario atualizado com sucesso`, user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao alterar informações do usuário' });
    }
} 