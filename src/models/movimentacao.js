const mongoose = require('mongoose')
const MovimentacaoSchema =  new mongoose.Schema({
    descricao: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true 
    },
    tipo: {
        type: String,
        required: true
    },
    valor: {
        type: Number,
        required: true
    }
})

mongoose.model('Movimentacao', MovimentacaoSchema)

module.exports = mongoose