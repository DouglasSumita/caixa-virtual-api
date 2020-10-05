const mongoose = require('mongoose')
const CategoriaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true     
    }
})

mongoose.model('Categoria', CategoriaSchema)

module.exports = mongoose