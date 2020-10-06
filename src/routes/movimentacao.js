const app = require('express').Router()
const movimentacaoController = require('../controllers/movimentacaoController')
const Resposta = require('../entidades/Resposta')

app.use((req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(400).send(new Resposta("'Authorization' não informado!"))
    }
    next()
})
app.get('/movimentacoes', movimentacaoController.listagem)
app.get('/movimentacao/:id', movimentacaoController.listagemById)
app.post('/movimentacao', movimentacaoController.novo)
app.put('/movimentacao/:id', movimentacaoController.atualiza)
app.delete('/movimentacao/:id', movimentacaoController.exclui)

module.exports = app