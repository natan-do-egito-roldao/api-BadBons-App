import User from '../../models/userModel.js';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary, v2 } from 'cloudinary';
import fs from 'fs';


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

export async function alterImage(req,res) {
    try {
        console.log("entrou")
        const tokenUserId = req.user.sub
        const userId = req.params.userId;
        const image = req.file.path;

        if (tokenUserId == userId) {
            if (!image) {
                return res.status(400).json({ error: "imagem não selecionada"})
            }

            const result = await cloudinary.uploader.upload(image, {
                resource_type: 'image',
                folder: `users/${userId}`, // opcional: organiza as imagens por usuário
            });

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { foto: result.secure_url },
                { new: true }
            );

            // Remove arquivo temporário
            fs.unlinkSync(image);

            return res.status(200).json({
                message: 'Imagem enviada com sucesso!',
                urlFoto: result.secure_url,
                usuarioAtualizado: updatedUser,
            });
        } else {
            return res.status(401).json({ error: "Ids não batem"})
        }
        

    } catch(error) {
        console.log(error)
        return res.status(500).json({ error: error})
        
    }

}