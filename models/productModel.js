const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter Product Name']
    },
    description:{
        type:String,
        required:[true,'Please enter Product Description']
    },
    price:{
        type:Number,
        required:[true,'Please enter Product Price'],
        maxLength:[8,'Price can not exceed 8 character']
    },
    rating:{
        type:Number,
        default:0
    },
    images:[{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }],
    category:{
        type:String,
        required:[true,'Please enter Product Category']
    },
    stock:{
        type:Number,
        default:1,
        maxLength:[4,'Stock length not greater than 3 character']
    },
    numOfReview:{
        type:Number,
        default:0
    },
    reviews:[{
        name:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            required:true
        },
        comment:{
            type:String,
            required:[true,'Product comment is Required']
        }
    }],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Product',productSchema)