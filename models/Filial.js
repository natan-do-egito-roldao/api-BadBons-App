const mongoose = require('mongoose');

const filialSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    endereco: {type: String, required: true},
    telefone: {type: String, required: true},
    valorDiaria: {type: Number, required: true},
    ativa: {type: Boolean, required: true},
    bairro: {type: String, required: true},
});

module.exports = mongoose.model('Filial', filialSchema);