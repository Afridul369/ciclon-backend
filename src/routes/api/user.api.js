const exprees = require('express')
const _ = exprees.Router()
const UserController = require('../../controller/user.controller')

_.route('/registration').post(UserController.Registration)
_.route('/verify-account').post(UserController.VerifyUser)
_.route('/resend-otp').post(UserController.ResendOtp)
_.route('/forgot-password').post(UserController.ForgotPassword)
_.route('/reset-password').post(UserController.ResetPassword)
_.route('/login').post(UserController.Login)
_.route('/logout').post(UserController.Logout)


module.exports = _