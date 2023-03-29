const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken');
const userModel = require("../models/userModel");

exports.authenticationUser = catchAsyncError(async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler('Login First',401))
    }
    const decodeData = jwt.verify(token,process.env.JWT_SECRET,)
    
    req.user = await userModel.findById(decodeData.id)

    next();

})

exports.authenticationUserRole = (...roles)=>{
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler('Not allow to access this resource',401))
        }
        next();
    }
}