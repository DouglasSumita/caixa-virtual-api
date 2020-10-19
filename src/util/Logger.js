class Logger {
    constructor() {
        this.config = {
            appName: 'Não configurado'
        }
    }

    setConfig(config) {
        this.config = config
    }
    
    log(mensagem, ...parametros) {
        console.log(this.config.appName, mensagem, parametros)
    }
}

module.exports = new Logger()