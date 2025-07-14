import express from 'express';
import dotenv from 'dotenv';
import Athlete from './routes/auth.routes.js';
import athleteAdminRoutes from './routes/admin/user.routes.js';
import unitAdminRoutes from './routes/admin/unit.routes.js';
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Rotas
app.use('/api/auth', Athlete);
app.use('/api/admin/athlete', athleteAdminRoutes);
app.use('/api/unit', unitAdminRoutes);

// Teste de rota
app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

// Conexão e inicialização
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
}).catch((err) => {
  console.error('Erro ao conectar com o banco:', err);
});