const exprees = require('express')
const _ = exprees.Router()

_.use('/auth', require('./api/user.api'))
_.use('/category', require('./api/category.api'))
_.use('/subcategory', require('./api/subCategory.api'))

module.exports = _