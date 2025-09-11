import Athlete from '../../models/userModel.js';
export async function approveUser(req,res) {
    try {
        const userId = req.params.userId
        const user = await Athlete.findById(userId)
        if (!user) return res.status(404).json({ error: 'usuario nao encotnrado'})
        
            if (user.status == 'active') {
                return res.status(400).json({ error: 'usuario ja aprovado'})
            }

            user.status = 'active'
            await user.save()

            res.json({ message: 'usuario aprovado com sucesso' })
    } catch (error) {
        console.error('Erro ao aprovar usuario:', error)
        res.status(500).json({ error: 'Erro ao aprovar usuario' })
    }
}

export async function disapproveUser(req,res) {
    try {
        const userId = req.params.userId
        const user = await Athlete.findById(userId)
        if (!user) return res.status(404).json({ error: 'usuario nao encotnrado'})
        
            if (user.status == 'rejected') {
                return res.status(400).json({ error: 'usuario ja reprovado'})
            }

            user.status = 'rejected'
            await user.save()

            res.json({ message: 'usuario reprovado com sucesso' })
    } catch (error) {
        console.error('Erro ao reprovar usuario:', error)
        res.status(500).json({ error: 'Erro ao reprovar  usuario' })
    }
}