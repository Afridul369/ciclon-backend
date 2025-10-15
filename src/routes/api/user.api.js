const exprees = require('express')
const _ = exprees.Router()
const UserController = require('../../controller/user.controller')

_.route('/registration').post(UserController.Registration)
_.route('/verify-account').post(UserController.VerifyUser)
_.route('/resend-otp').post(UserController.ResendOtp)
_.route('/forgot-password').post(UserController.ForgotPassword)


module.exports = _