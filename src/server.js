const express= require('express')
const app = express()
const bodyParser = require('body-parser')
const categoria = require('./routes/categoria')
const movimentacao = require('./routes/movimentacao')
const bancoDados = require('./util/bancoDados')
const PORT = process.env.PORT || 3000
const cors = require('cors')
const Logger = require('./util/Logger')

bancoDados.connect()

Logger.setConfig({
    appName: '- API Caixa virtual -'
})

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/', categoria)
app.use('/', movimentacao)

app.listen(PORT, () => Logger.log(`O servidor esta rodando na porta: ${PORT}`))