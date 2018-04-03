const { environment } = require('@rails/webpacker')
const typescript =  require('./loaders/typescript')

environment.loaders.set('typescript', typescript)
module.exports = environment
