import User from '../../models/userModel.js';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary, v2 } from 'cloudinary';
import { Console } from 'console';
import fs from 'fs';


export async function alterInfo(req,res) {
    try{
        const oldPassword = req.body.oldPassword;
        const userId = req.user.sub;
        const user = await User.findById(userId);
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        const data = req.body;

        if (!((Object.keys(data).includes('nome') || Object.keys(data).includes('email') || Object.keys(data).includes('telefone') || Object.keys(data).includes('newPassword')))) {
            return res.status(400).json({ error: 'Nenhum dado fornecido para alteração' });
        }
        const allowedFields = ['nome', 'email', 'telefone', 'newPassword'];
        const alterData = {};
        
        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
                alterData[field] = data[field];
            }
        });

        if (Object.keys(alterData).includes('newPassword') && isMatch) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(alterData.newPassword, salt);
            alterData.newPassword = hashedPassword;
            alterData.tokenVersion += 1;
        }

        if (!isMatch) {
            return res.status(400).json({ error: 'Senha antiga incorreta' });
        }
        
        const newUser = await User.findByIdAndUpdate(userId, alterData, { new: true });

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
        const userId = req.user.sub;
        const image = req.file.path;
        console.log(userId, image)
        if (!image) {
            return res.status(400).json({ error: "imagem não selecionada"})
        }

        const result = await cloudinary.uploader.upload(image, {
            resource_type: 'image',
            folder: `users/${userId}`, // opcional: organiza as imagens por usuário
        });
        console.log(result)
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

    } catch(error) {
        console.log(error)
        return res.status(500).json({ error: error})
        
    }

}

export async function getData(req,res) {
    try {
        const userId = req.user.sub;
        const user = await User.findById(userId).select('-password -activeDevices -tokenVersion');

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.status(200).json({ user });

    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar dados do usuário' });
    } 
}