const exprees = require('express')
const _ = exprees.Router()
const UserController = require('../../controller/user.controller')

_.route('/registration').post(UserController.Registration)
_.route('/login').get(UserController.login)


module.exports = _