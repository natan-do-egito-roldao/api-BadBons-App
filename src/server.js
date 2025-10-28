import express from 'express';
import dotenv from 'dotenv';
import Auth from './routes/auth/auth.routes.js';
import athleteAdminRoutes from './routes/admin/user.routes.js';
import unitAdminRoutes from './routes/admin/unit.routes.js';
import { connectDB } from './config/db.js';
import userRoutes from './routes/user/info.routes.js';
import unitRoutes from './routes/unit/unit.routes.js';
import { v2 as cloudinary, v2 } from 'cloudinary';
dotenv.config();
import { jobResetTagDay } from "./jobs/jobResetTags.js";
import traininLocationRoutes from './routes/oldApi/trainingLocation.js';
import timetableUnitsRoutes from './routes/oldApi/timetableUnits.js';
import registreRoute from './routes/oldApi/registre.js';
import loginRoute from './routes/oldApi/login.js';
import credentialsRoute from './routes/oldApi/credentials.js';
import loginTokenRoute from './routes/oldApi/loginToken.js';
import imgRoute from './routes/oldApi/img.js';
import imgUserRoutes from './routes/oldApi/imgUSer.js';
import swapEmailRoutes from './routes/oldApi/swapEmailRoutes.js';
import swapPasswordRoutes from './routes/oldApi/swapPassword.js';
import swapCredentialsRoutes from './routes/oldApi/swapCredentials.js';
import mongoose from "mongoose";
import { login } from './controllers/auth.controller.js';

const permitedVersion = ["1.0.0", "1.0.1"]; 


const app = express();
const PORT = process.env.PORT || 3000;
const api_secret = process.env.CLOUD_SECRET
const api_key = process.env.CLOUD_KEY

v2.config({ 
  cloud_name: 'dccx9drur', 
  api_key: api_key, 
  api_secret: api_secret
});

// Middlewares
app.use(express.json());

// Rotas
app.use('/auth', Auth);
app.use('/admin', athleteAdminRoutes);
app.use('/admin/unit', unitAdminRoutes);
app.use('/user', userRoutes);
app.use('/unit', unitRoutes);

//loucuras do criador do frontend 
app.use('/training-locations', traininLocationRoutes)
app.use('/timetable-units', timetableUnitsRoutes);
app.use('/registre', registreRoute);
app.use('/login', loginRoute);
app.use('/credentials', credentialsRoute);
app.use('/login-token', loginTokenRoute);
app.use('/img/:img', imgRoute);
app.use('/upload-photo-profile', imgUserRoutes);
app.use('/swap-email', swapEmailRoutes);
app.use('/swap-password', swapPasswordRoutes);
app.use('/swap-credentials', swapCredentialsRoutes);

// Teste de rota
app.get('/ping', (req, res) => {
  const version = req.query.version
  if (!permitedVersion.includes(version)) {
    return res.sendStatus(426);
  }
  return res.sendStatus(200);
});

// Conexão e inicialização
connectDB()
  .then(async () => {
    await jobResetTagDay(mongoose.connection.db);

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar com o banco:", err);
  });
