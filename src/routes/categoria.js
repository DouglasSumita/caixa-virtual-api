const app = require('express').Router()
const categoriaController = require('../controllers/categoriaController')

app.get('/categorias', categoriaController.listagem)
app.get('/categoria/:id', categoriaController.listagemById)
app.post('/categoria', categoriaController.novo)
app.put('/categoria/:id', categoriaController.atualiza)
app.delete('/categoria/:id', categoriaController.exclui)

module.exports = app