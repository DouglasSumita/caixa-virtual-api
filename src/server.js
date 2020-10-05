const express= require('express')
const app = express()
const bodyParser = require('body-parser')
const categoria = require('./routes/categoria')
const movimentacao = require('./routes/movimentacao')
const bancoDados = require('./controllers/bancoDadosController')
const PORT = process.env.PORT || 3000

bancoDados.connect()

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', '*')
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
})

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/', categoria)
app.use('/', movimentacao)

app.listen(PORT, () => console.log("The server is running on the port", PORT))