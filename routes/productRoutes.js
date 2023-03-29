const express = require('express');
const router = express.Router();
const {getAllProducts, createProduct, updateProducts, deleteProduct, getProductDetails} = require('../controllers/productController');
const { authenticationUser, authenticationUserRole } = require('../middleware/auth');

router.route('/product').get(getAllProducts);
router.route('/product/new').post(authenticationUser,authenticationUserRole('Admin'),createProduct);
router.route('/product/:id').put(authenticationUser,authenticationUserRole('Admin'),updateProducts).delete(authenticationUser,authenticationUserRole('Admin'),deleteProduct).get(getProductDetails);
//router.route('/product/:id').delete(deleteProduct);
module.exports = router
