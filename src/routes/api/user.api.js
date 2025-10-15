const exprees = require('express')
const _ = exprees.Router()
const UserController = require('../../controller/user.controller')

_.route('/registration').post(UserController.Registration)
_.route('/verify-account').post(UserController.VerifyUser)


module.exports = _