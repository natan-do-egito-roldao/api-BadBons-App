// backend/config/database.js
require('dotenv').config();  // Usando 'require' como antes

const mongoose = require('mongoose');  // Usando 'require' para o mongoose

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Conectado ao MongoDB!'))
.catch((error) => console.log('Erro de conexão com MongoDB:', error));

    