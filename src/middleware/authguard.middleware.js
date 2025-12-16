const { asyncHandler } = require("../utils/asynchandeler");
const jwt = require('jsonwebtoken');
const { customError } = require("../utils/customError");
const userModel = require('../models/user.model')


exports.AuthGuard = asyncHandler(async(req,res,next)=>{
    const accessToken = req?.headers?.authorization.replace("Bearer ","")
    // console.log(accessToken);
    const tokenVerify = jwt.verify(accessToken, process.env.ACCESSTOKEN_SECRET)
        if(!tokenVerify) throw new customError(400,"Token Invalid/Expired !!")
    // console.log(tokenVerify);
    const userInfo = await userModel.findById(tokenVerify.userid)
    // console.log(userInfo);  
        if(!userInfo) throw new customError(400,"User Not Found !!")
        req.user = userInfo
        next()
})