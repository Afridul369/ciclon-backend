const { asyncHandler } = require("../utils/asynchandeler");
const {apiResponse} = require('../utils/apiResponse')
const {customError} =  require('../utils/customError')
const userModel = require('../models/user.model');
const { validateUser } = require("../validation/user.validation");
const { Otp, emailSend } = require("../helper/nodeMailer");
const { registrationTemplate } = require("../template/emailTemplate");
const { sendSms } = require("../helper/sms");

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

    const verifyEmailLink =  `www.frontend.com/verifyEmail/${user.email}`;
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
        const smsBody = `Hello ${user.name},

        Thank you for registering with us!

        Your registered email: ${user.email}
        Your OTP code: ${otp}

        Please verify your email by clicking the link below:
        ${verifyEmailLink}

        Note: This link and OTP will expire on ${new Date(expireDate).getMinutes()}.

        If you did not request this registration, please ignore this message.

        Best regards,  
        Afridul`

        const Sms = await sendSms(user.phoneNumber , smsBody)
        if (Sms?.data?.response_code !== 202) {
            throw new customError(500, error_message)
        }
    }
    const save = await user.save()
    console.log(save);
    apiResponse.sendSucces(res,201,'Registration Succesful' , {name : user.name})


    // console.log(value);
    // throw new customError(477,'email missing')
    
})

exports.login = asyncHandler((req,res)=>{
    console.log('from login');
})