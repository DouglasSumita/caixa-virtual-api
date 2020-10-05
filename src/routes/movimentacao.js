const app = require('express').Router()
const movimentacaoController = require('../controllers/movimentacaoController')

app.get('/movimentacoes', movimentacaoController.listagem)
app.get('/movimentacao/:id', movimentacaoController.listagemById)
app.post('/movimentacao', movimentacaoController.novo)
app.put('/movimentacao/:id', movimentacaoController.atualiza)
app.delete('/movimentacao/:id', movimentacaoController.exclui)

module.exports = app