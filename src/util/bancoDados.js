const MongooseService = require('../services/MongooseService')
const mongooseService = new MongooseService()
const Logger = require('../util/Logger')

mongooseService.setConfig({
    local: 'mongodb://caixavirtualadm:caixavirtual123@mongo_caixa-virtual:27017/',
    dataBaseName: 'caixa-virtual',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }
})

async function connect() {
    Logger.log(await mongooseService.connect())
}

module.exports = {
    connect
}    