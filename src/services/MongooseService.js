const mongoose = require('mongoose')

class MongooseService {

    constructor() {
    }
    
    /**
     * Seta as configurações de conexao com banco de dados do mongodb.
     * 
     * @param {*} config object
     * @return void
     */
    setConfig(config) {
        this.URI = config.local + config.dataBaseName
        this.dataBaseName = config.dataBaseName
        this.options = config.options
    }

    setDataBaseName(name) {
        this.dataBaseName = name
    }

    getDataBaseName() {
        return this.dataBaseName
    }

    setURI(URI) {
        this.URI = URI
    }

    getURI() {
        return this.URI
    }

    setOptions(options) {
        this.options = options
    }

    getOptions() {
        return this.options
    }
    
    setPromise() {
        mongoose.Promise = global.Promise;
    }
    
    /**
     * Realiza a conexão com banco de dados, referente a URI e options configurada.
     * 
     * @return mensagem string
     */
    async connect() {

        this.setPromise()
        try {
            await mongoose.connect(this.URI, this.options)
            return `Conectado ao banco de dados: ${dataBaseName}`
        } catch(e) {
            return `Erro ao conectar ao banco de dados, erro: ${e.message}`
        }
    }
}

module.exports = MongooseService