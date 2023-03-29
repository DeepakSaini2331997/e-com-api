const express = require('express')
const router = express.Router();
const {createUser, loginUser, logoutUser, forgetPassword, resetPassword} = require('../controllers/userController')

router.route('/register').post(createUser);
router.route('/loginUser').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/forgetPassword').post(forgetPassword);
router.route('/password/reset/:token').put(resetPassword)

module.exports = router