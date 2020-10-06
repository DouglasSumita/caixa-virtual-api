const express= require('express')
const app = express()
const bodyParser = require('body-parser')
const categoria = require('./routes/categoria')
const movimentacao = require('./routes/movimentacao')
const bancoDados = require('./util/bancoDados')
const PORT = process.env.PORT || 3000
const cors = require('cors')

bancoDados.connect()

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/', categoria)
app.use('/', movimentacao)

app.listen(PORT, () => console.log("The server is running on the port", PORT))