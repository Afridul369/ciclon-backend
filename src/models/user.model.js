const mongoose = require('mongoose')
const {Types, Schema} = mongoose
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { customError } = require('../utils/customError');
const userSchema = new Schema({
    name:{
        type: String,
        trim: true
    },
    email:{
        type: String,
        trim: true,
        unique: true,
        sparse: true
    },
    password:{
        type: String,
        trim: true,
        required: [true, 'Password Missing'],
    },
    phoneNumber:{
        type: Number,
        trim: true,
        unique: true,
        parse: true
    },
    image:{
        type: String,
        trim : true
    },
    emailVerified:{
        type: Boolean,
        default : false
    },
    phoneNumberVerified:{
        type: Boolean,
        default : false
    },
    address:{
        type: String,
        trim: true
    },
    city:{
        type: String,
    },
    district:{
        type: String,
    },
    role:{
        type : Types.ObjectId,
        ref : 'Role'
    },
    permission:{
        type : Types.ObjectId,
        ref: 'Permission'
    },
    country:{
        type: String,
        default : 'Bangladesh'
    },
    zipcode:{
        type: Number,
        max: 6
    },
    dateofbirth:{
        type: Date,
        trim: true
    },
    gender:{
        type: String,
        enum :['Male','Female', 'Other']
    },
    lastLogin:{
        type : Date
    },
    lastLogout:{
        type : Date
    },
    newsLetterSubscribe:{
        type : Boolean,
        default: false
    },
    resetPasswordOtp:{
        type : Number
    },
    resetPasswordExpires:{
        type : Date
    },
    twoFactorEnabled:{
        type : Boolean,
        default: false
    },
    isBlocked:{
        type: Boolean,
        default: false
    },
    isActive:{
        type: Boolean,
        default: false
    },
    reFreshToken:{
        type: String,
        trim: true
    },
    oauth: Boolean,
    cart :{
        type: Types.ObjectId,
        ref : 'Product'
    },
    Wishlist :{
        type: Types.ObjectId,
        ref : 'Product'
    },
},{
    timestamps: true
})

// make a hash password
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const hashPass = await bcrypt.hash(this.password, 10)
        this.password =  hashPass
    }
    next()
})

// compare hash password
userSchema.methods.comparePassword = async function (humanPass) {
    return await bcrypt.compare(humanPass, this.password);
}

// Generate Access Token
userSchema.methods.generateAccesstoken = async function () {
    const accessToken = jwt.sign({
    userid: this._id,
    name: this.name,
    email: this.email,
    role: this.role
}, process.env.ACCESSTOKEN_SECRET, { expiresIn: process.env.ACCESSTOKEN_EXPIRES });
    return accessToken
}

// Generate Refresh Token
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign({
    userid: this._id,
}, process.env.REFRESHTOKEN_SECRET, { expiresIn: process.env.REFRESHTOKEN_EXPIRES });
}

// verify access token
userSchema.methods.verifyAccessToken = async function (token) {
    const isValidAccessToken = await jwt.verify(token, process.env.ACCESSTOKEN_SECRET)
    if (!isValidAccessToken) {
        throw new customError(401, 'Your Token Is Invalid')
    }
}

// verify refresh token
userSchema.methods.verifyRefreshToken = async function (token) {
    const isValidRefreshToken = await jwt.verify(token, process.env.REFRESHTOKEN_SECRET)
    if (!isValidRefreshToken) {
        throw new customError(401, 'Your Refresh Token Is Invalid')
    }
}


module.exports = mongoose.model("User", userSchema)