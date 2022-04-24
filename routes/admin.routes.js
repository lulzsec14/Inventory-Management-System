const express = require('express');
const {
  registerAdmin,
  verifyAdmin,
  verifyEmail,
  addNewStock,
  createNewCategory,
  updateStock,
  sellStock,
  getStockByCategory,
  getPurchasedStocks,
  getSoldStocks,
  getBuyPayments,
  getSellPayments,
  loginAdmin,
  logoutAdmin,
  updateAdminDetails,
  forgotPassword,
  resetPassword,
} = require('../controllers/Admin/adminController');
const { checkAdmin } = require('../middlewares/adminAuth');
const adminRouter = express.Router();

adminRouter.route('/registerAdmin').post(registerAdmin);
adminRouter.route('/loginAdmin').post(loginAdmin);
adminRouter.route('/logoutAdmin').delete(checkAdmin, logoutAdmin);
adminRouter.route('/verify-email/:emailToken').get(verifyAdmin);
adminRouter.route('/forgotPassword').post(checkAdmin, forgotPassword);
adminRouter.route('/passwordReset/:resetToken').put(checkAdmin, resetPassword);
adminRouter.route('/updateAdminDetails').put(checkAdmin, updateAdminDetails);
adminRouter.route('/getEmailVerification').get(checkAdmin, verifyEmail);
adminRouter.route('/createNewStock').post(checkAdmin, addNewStock);
adminRouter.route('/createCategory').post(checkAdmin, createNewCategory);
adminRouter.route('/updateStockDetails').put(checkAdmin, updateStock);
adminRouter.route('/sellStock').delete(checkAdmin, sellStock);
adminRouter.route('/getCurrentStocks').get(checkAdmin, getStockByCategory);
adminRouter.route('/getPurchasedStocks').get(checkAdmin, getPurchasedStocks);
adminRouter.route('/getSoldStocks').get(checkAdmin, getSoldStocks);
adminRouter.route('/getPaymentsMade').get(checkAdmin, getBuyPayments);
adminRouter.route('/getPaymentsRecieved').get(checkAdmin, getSellPayments);

module.exports = adminRouter;
