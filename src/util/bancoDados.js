const MongooseService = require('../services/MongooseService')
const Logger = require('../util/Logger')

async function connect(mongooseService = new MongooseService()) {
    mongooseService.setConfig({
        local: 'mongodb://caixavirtualadm:caixavirtual123@mongo_caixa-virtual:27017/',
        dataBaseName: 'caixa-virtual',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }
    })
    Logger.log(await mongooseService.connect())
}

module.exports = {
    connect
}    