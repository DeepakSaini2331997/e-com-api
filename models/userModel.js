const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,'Please enter user name'],
        maxLength:[30,'Name can not excced 30 character'],
        minLength:[3,'Name should have more 3 character']
    },
    email:{
        type:String,
        require:[true,'Please enter user email'],
        unique:true,
        validate:[validator.isEmail,'Please Enter valid Email']
    },
    password:{
        type:String,
        require:[true,'Please enter password'],
        minLength:[8,'Password should have 8 character'],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:'User'
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
})

//create bcrypt password after save
userSchema.pre("save", async function (next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password,10)
})

// generate json token
userSchema.methods.getJWTToken = function (){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES})
}

//compare password
userSchema.methods.comparePassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword,this.password)
}

//Reset password Generate
userSchema.methods.getResetPasswordToken = function (){
    //Generate Token
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire =  Date.now()+15*60*1000;
    return resetToken
}

module.exports = mongoose.model('User',userSchema)