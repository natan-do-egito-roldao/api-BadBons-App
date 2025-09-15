import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const reAuth = async (req, res, next) => {
    try {
        const password = req.body.password || '';
        if (!password) {
            return res.status(401).json({ error: 'senha ausente'})
        }

        const authPassword = await bcrypt.compare(password, user.password)
        if (!user || !authPassword) {
            return res.status(401).json({ error: 'senha inválida'})
        }

        const token = jwt.sign(
            { sub: user._id, role: user.role, tv: user.tokenVersion  },
            process.env.JWT_SECRET,
            { expiresIn: '5m' }
        )

        res.json({ message: 'Verificação feita com sucesso', token: token })
        next()

    } catch (error) {
        return res.status(500).json({ error: 'Erro interno do servidor' })
    }
}

