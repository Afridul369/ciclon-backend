require('dotenv').config()
const nodemailer = require("nodemailer");
const crypto = require('crypto')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: process.env.NODE_ENV == 'development' ? false : true, 
  auth: {
    user: process.env.HOST_MAIL,
    pass: process.env.HOST_APP_PASS,
  },
});


// emailSend to registered
exports.emailSend = async (email,subject,template)=>{
    const info = await transporter.sendMail({
        from: 'Node 2501',
        to: Array.isArray(email) ? `${email.join(',')}` : email,
        subject: subject,
        text: "Hello world?", 
        html: template, 
  });
  console.log("Message sent:", info.messageId);
  return info.messageId;
}

exports.Otp = ()=>{
    return crypto.randomInt(1000,9999)
}