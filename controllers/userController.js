const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middleware/catchAsyncError');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');

exports.createUser = catchAsyncError(async(req,res,next) =>{
    const {name,email,password} = req.body
    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:'profileId',
            url:'profileImageUrl'
        }
    })

    // const token = user.getJWTToken();

    // res.status(200).json({
    //     success:true,
    //     token
    // })
    sendToken(user,201,res)

})

exports.loginUser = catchAsyncError(async (req,res,next)=>{
    const {email,password} = req.body
    if(!email || !password){
        return next(new ErrorHandler('Please enter email and password',401))
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler('User email and password is not match',401))
    }
    const isPasswordMatch = await user.comparePassword(password)

    if(!isPasswordMatch){
        return next(new ErrorHandler('User email and password is not match',401))
    }

    // const token = user.getJWTToken();

    // res.status(200).json({
    //     success:true,
    //     token
    // })
    
    sendToken(user,200,res)

})

//Logout 
exports.logoutUser = catchAsyncError (async(req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:'Logout Successfully !'
    })
})

//Forget password and Reset password
exports.forgetPassword = catchAsyncError(async(req,res,next)=>{
    const {email} = req.body
    const user = await User.findOne({email})

    if(!user){
        return next(new ErrorHandler('user not found',404))
    }
    //ResetToken
    const resetToken = user.getResetPasswordToken()

    await user.save({validateBeforeSave:true})

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Your Reset password token is \n\n ${resetPasswordUrl} \n\n If you are not requst pls ignore this email.`;

    try{
        await sendEmail({
            email:user.email,
            subject:'Reset Password Recovery',
            message
        })
        res.status(200).json({
            success:true,
            message:`Email send successfully sent to this emailId -: ${user.email}`
        })
    }catch(error){
        user.resetPasswordToken =undefined;
        user.resetPasswordExpire =undefined;
        await user.save({validateBeforeSave:true})
        return next(new ErrorHandler(`Your Error is -: ${error}`,404))
    }

})

exports.resetPassword = catchAsyncError(async(req,res,next)=>{
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await user.find({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    })

    if(!user){
        return next(new ErrorHandler('Reset token is wrong or has been expire.',400))
    }

    if(req.body.password != req.body.confirmPassword){
        return next(new ErrorHandler('Password is not match.',400))
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire= undefined

    await user.save();
    sendToken(user,200,res);
})