import User from '../../models/userModel.js';
export async function alterInfo(req,res) {
    try{
        const userId = req.params.userId;
        const data = req.body;

        if (Object.keys(data).length === 0) {
            return res.status(400).json({ error: 'Nenhum dado fornecido para alteração' });
        }

        const allowedFields = ['nome', 'email', 'telefone'];
        const alterData = {};
        
        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
                alterData[field] = data[field];
            }
        });

        const newUser = await User.findByIdAndUpdate(userId, alterData, { new: true });

        if (!newUser) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json({ message: `usuario atualizado com sucesso` });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao alterar informações do usuário' });
    }
} 