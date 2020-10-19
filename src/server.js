const app = require('./app')
const bancoDados = require('./util/bancoDados')
const PORT = process.env.PORT || 3000
const Logger = require('./util/Logger')

bancoDados.connect()

Logger.setConfig({
    appName: '- API Caixa virtual -'
})

app.listen(PORT, () => Logger.log(`O servidor esta rodando na porta: ${PORT}`))