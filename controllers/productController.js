const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middleware/catchAsyncError')
const ApiFeatures = require('../utils/apiFeatures')


//create product
exports.createProduct = catchAsyncError(async (req,res,next) =>{
    req.body.user = req.user.id;
    const product = await Product.create(req.body)
    res.status(201).json({
        success:true,
        product
    })
})

//get product
exports.getAllProducts = catchAsyncError(async (req,res )=>{
    const pagelimit = process.env.PAGINATIONLIMIT 
    const countTotalProduct = await Product.countDocuments();
    const apiFeatures = new ApiFeatures(Product.find(),req.query).search().filter().pagination(pagelimit);
    const products = await apiFeatures.query;
    res.status(200).json({
        success:true,
        products,
        countTotalProduct
    })
})

//update product
exports.updateProducts = catchAsyncError(async (req,res,next) => {
    let product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler('Product Not Found',404))
        // return res.status(404).json({
        //     success:false,
        //     message:'Product Not Found'
        // })
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        product
    })
})

//delete product
exports.deleteProduct = catchAsyncError(async (req,res,next) =>{
    const product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler('Product Not Found',404))
        // return res.status(500).json({
        //     success:false,
        //     message:'Product Not Found'
        // })
    }

    await Product.remove(req.params.id)
    res.status(200).json({
        success:true,
        message:'Product Delete Successfully Delete'
    })
})

//get product details
exports.getProductDetails = catchAsyncError(async (req,res,next) =>{
    let product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler('Product Not Found',404))
        // return res.status(500).json({
        //     success:false,
        //     message:'Product Not Found'
        // })
    }

    res.status(200).json({
        succes:true,
        product
    })
})

