const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Ranking = require('./routes/rankingRoutes');
const athleteRoutes = require('./routes/athleteRoutes');
const authRoutes = require('./routes/authRoutes');
const filialRoutes = require('./routes/filialRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const treinoRoutes = require('./routes/treinosRoutes');
const verifyAdminToken = require('./middleware/adminAuthMiddleware');
const Desafio = require('./routes/desafioRoutes');
const verifyAdminRoutes = require('./routes/verifyAdm');

const app = express();
const server = http.createServer(app);

// Conectando ao MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000, // 30 segundos
    socketTimeoutMS: 45000 // 45 segundos
}).then(() => {
    console.log('Conectado ao MongoDB');
}).catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err);
});

app.use(cors());
app.use(express.json());

// Rotas públicas
app.use('/api', adminAuthRoutes);
app.use('/api', authRoutes);

// Rotas
app.use('/api/ranking', Ranking);
app.use('/api/atletas', athleteRoutes);
app.use('/api/filiais', verifyAdminToken, filialRoutes);
app.use('/api/treinos', treinoRoutes);
app.use('/api/desafios', Desafio);
app.use('/api/adm', verifyAdminRoutes);

  

// Porta do servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});