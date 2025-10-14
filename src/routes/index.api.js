const exprees = require('express')
const _ = exprees.Router()

_.use('/auth', require('./api/user.api'))

module.exports = _