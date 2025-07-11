import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.Mongo_URI)
        console.log('✅ Conexão com o MongoDB estabelecida com sucesso')
    } catch (err) {
        console.log('❌ Erro ao conectar ao MongoDB:', err.message)
        process.exit(1)
    }
}