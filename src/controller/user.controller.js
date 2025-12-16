const { asyncHandler } = require("../utils/asynchandeler");
const {apiResponse} = require('../utils/apiResponse')
const {customError} =  require('../utils/customError')
const userModel = require('../models/user.model');
const { validateUser } = require("../validation/user.validation");
const { Otp, emailSend } = require("../helper/nodeMailer");
const { registrationTemplate, resendOtpTemplate } = require("../template/emailTemplate");
const { sendSms } = require("../helper/sms");
const { now } = require("mongoose");
const jwt = require('jsonwebtoken')

exports.Registration = asyncHandler(async(req,res)=>{

    const value = await validateUser(req)

    const user = await new userModel({
        name: value.name,
        email: value.email || null,
        password: value.password,
        phoneNumber: value.phoneNumber || null,
    }).save()

    if (!user) {
        throw new customError(500, 'User Or Register Server Error !!')
    }

    const verifyEmailLink =  `www.frontend.com/verifyAccount/${user.email}`;
    const otp = Otp();
    const expireDate = Date.now() + 10*60*60*1000;
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = expireDate;

    if (user.email) {
        const template = registrationTemplate(user.name, user.email, otp , expireDate , verifyEmailLink)   
        // now send email
        const result = await emailSend(user.email,"Email Verified !!",template)
        if (!result) {
            throw new customError(500, 'Email Not Send')
        }        
    }else{
        const verifyPhonenumberLink = `www.frontend.com/verifyAccount/${user.phoneNumber}`
        const smsBody = `Hello ${user.name},
        Thank you for registering with us!
        Your OTP code: ${otp}
        Please verify your email by clicking the link below:
        ${verifyPhonenumberLink}
        Note: This link and OTP will expire on ${new Date(expireDate).getTime()}.
        If you did not request this registration, please ignore this message.
        Best regards,  
        Afridul`
        const Sms = await sendSms(user.phoneNumber , smsBody)    
    }
    await user.save()
    apiResponse.sendSucces(res,201,'Registration Succesful' , {name : user.name})
    
})

exports.VerifyUser = asyncHandler(async(req,res)=>{
    const {email,phoneNumber,otp} = req.body
    if (!otp) {
        throw new customError(401,"Otp Not Found !!")
    }   
    const validUser = await userModel.findOne({email:email,phoneNumber:phoneNumber})
    if (!validUser) {
        throw new customError(401,"User Not Found !!")
    }
    if (email && validUser.resetPasswordOtp == otp && validUser.resetPasswordExpires > Date.now()) {
        validUser.emailVerified = true
        validUser.isActive = true
        validUser.resetPasswordOtp = null
        validUser.resetPasswordExpires = null
        await validUser.save()
    }
    if (phoneNumber && validUser.resetPasswordOtp == otp && validUser.resetPasswordExpires > Date,now()) {
        validUser.phoneNumberVerified = true
        validUser.isActive = true
        validUser.resetPasswordOtp = null
        validUser.resetPasswordExpires = null
        await validUser.save()
    }
    apiResponse.sendSucces(res,200,"Your Otp Matched...Your Account Verified", {name:validUser.name})
    
})

exports.ResendOtp = asyncHandler(async(req,res)=>{
    const {email,phoneNumber} = req.body
    const User = await userModel.findOne({
        email:email, phoneNumber:phoneNumber
    })
    const otp = Otp();
    const expireDate = Date.now() + 10*60*60*1000;
    if (email) {
        const template = resendOtpTemplate(User.name, User.email, otp , expireDate )   
        await emailSend(User.email,"Otp Send !!",template)
        User.resetPasswordExpires = expireDate
        User.resetPasswordOtp = otp
        await User.save()
    }
    if (phoneNumber) {
        const smsBody = `Hello ${User.name},
        Your OTP code: ${otp}
        Note: This link and OTP will expire on ${new Date(expireDate).getTime()}.
        If you did not request this registration, please ignore this message.
        Best regards,  
        Afridul`
        await sendSms(User.phoneNumber , smsBody)    
        User.resetPasswordExpires = expireDate
        User.resetPasswordOtp = otp
        await User.save()
    }   
    apiResponse.sendSucces(res,200,'Your Otp Send ... Check Your PhoneNumber Or Email' , null )

})

exports.ForgotPassword = asyncHandler(async(req,res)=>{
    const {email,phoneNumber} = req.body
    if (!email && !phoneNumber) {
        throw new customError(401,'Your Email Or PhoneNumber Is Missing !!!')
    }
    const User = await userModel.findOne({email:email,phoneNumber:phoneNumber})
    if (!User) {
        throw new customError(401, 'This User Is Not Registered...Please Register First !!')
    }
    return res.status(301).redirect('https://www.creativeitinstitute.com/')
})

exports.ResetPassword = asyncHandler(async(req,res)=>{
    const {email,phoneNumber,newPassword,confirmPassword} = req.body
    if (!email && !phoneNumber) {
        throw new customError(401,'Please Give Your Registered Email Or Password')
    }
    if (!newPassword && !confirmPassword) {
        throw new customError(401,'NewPassword Or ConfirmPassword Missing !!')
    }
    let pattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/
    if (!pattern.test(newPassword)) {
        throw new customError(401, 'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.')
    }
    if (newPassword !== confirmPassword) {
        throw new customError(401,'NewPassword And ConfirmPassword IS Not Matched !! ')
    }
    const User = await userModel.findOne({email:email,phoneNumber:phoneNumber})
    User.password = newPassword
    await User.save()
    return res.status(301).redirect('https://www.creativeitinstitute.com/')
})

exports.Login = asyncHandler(async(req,res)=>{
    const {email,phoneNumber,password} = req.body
    if ((email === null || email === "") && (phoneNumber === null || phoneNumber === "")) {
        throw new customError(401,"Email Or PhoneNumber Is Missing !!")
    }
    let User;
    if (email) {
        User = await userModel.findOne({ email })
    } else if (phoneNumber) {
        User = await userModel.findOne({ phoneNumber })
    }
    if (!User) {
        throw new customError(401,'User Not Found..')
    }
    const checkPassword = await User.comparePassword(password)
    if (!checkPassword) {
        throw new customError(401,"Your Password Is Not Matched !!")
    }
    const accessToken = await User.generateAccesstoken()
    const refreshToken = await User.generateRefreshToken()
    res.cookie("RefreshToken", refreshToken,{
        httpOnly : true,
        // secure: process.env.NODE_ENV == "development" ? "false":"true",
        secure: false,
        sameSite : "lax",
        path: "/",
    })
    User.reFreshToken = refreshToken;
    await User.save()
    apiResponse.sendSucces(res,200, "Login Successfull ", {
        accessToken: accessToken,
        // userName : User.name,
        // email: User.email,
        // phoneNumber: User.phoneNumber
    })
})

exports.Logout = asyncHandler(async(req,res)=>{
    const token = req?.body?.token || req?.headers.authorization
    const {userid} = await jwt.verify(token, process.env.ACCESSTOKEN_SECRET)
    const User = await userModel.findById(userid)
    
    res.clearCookie("RefreshToken",{
        httpOnly : true,
        secure: process.env.NODE_ENV == "development" ? "false":"true",
        sameSite : "none",
        path: "/",
        maxAge : 15 * 24 * 60 * 60 * 1000,
    })
    User.reFreshToken = null
    await User.save()
    apiResponse.sendSucces(res,200, 'Logout Successfull', User.name)

})