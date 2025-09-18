import User from '../../models/userModel.js';
import { omit } from '../../services/omit.js';

export async function getQuantidadeTreinos(req,res) {
    try{
        const userId = req.user.sub;

        if (!userId) {
            return res.status(400).json({ error: 400});
        }

        const user = await User.findById(userId)
        const userSafe = omit(user._doc, [
            "__v",
            "treinosConcluidos",
            "nome",
            "_id",
            "status",
            "idade",
            "cpf",
            "email",
            "dataNascimento",
            "telefone",
            "sexo",
            "nivel",
            "unidade",
            "turma",
            "password",
            "statusNivel",
            "role",
            "treinosPendentes",
            "progresso",
            "tokenVersion",
            "criadoEm",
            "desafiosConcluidos",
            "userRanking",
            "activeDevices",
            "foto"
        ]);
        return res.json({ treinosFeitos: userSafe.treinosFeitos, treinosTotais: userSafe.treinosTotais });

    } catch (error) {
        res.status(500).json({ error: 'Erro ao alterar informações do usuário' });
    }
} 
