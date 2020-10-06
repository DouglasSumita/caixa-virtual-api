const mongoose = require('mongoose')
const dataBaseName = 'caixa-virtual'
const URI = 'mongodb://localhost/' + dataBaseName
const settings = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}

async function connect() {
    mongoose.Promise = global.Promise
    try {
        await mongoose.connect(URI, settings)
        console.log('Connected to the database', dataBaseName)
    } catch(e) {
        console.log('Error connecting to database', e)
    }
}

module.exports = {
    connect
}    