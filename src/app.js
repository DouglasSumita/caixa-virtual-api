const express = require('express')
const bodyParser = require('body-parser')
const categoria = require('./routes/categoria')
const movimentacao = require('./routes/movimentacao')
const cors = require('cors')

class AppController {
    constructor() {
        this.express = express()
        
        this.middlewares()
        this.routes()
    }

    middlewares() {
        this.express.use(cors())
        this.express.use(bodyParser.urlencoded({extended: false}))
        this.express.use(bodyParser.json())
    }
    
    routes() {
        this.express.use('/', categoria)
        this.express.use('/', movimentacao)
    }
}

module.exports = new AppController().express