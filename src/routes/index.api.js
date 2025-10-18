const exprees = require('express')
const _ = exprees.Router()

_.use('/auth', require('./api/user.api'))
_.use('/category', require('./api/category.api'))

module.exports = _