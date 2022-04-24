const mongoose = require('mongoose');
const crypto = require('crypto');
const log = require('../../Utils/Logger');
const Admin = require('../../models/Admin');
const Stock = require('../../models/Stock');
const textToHash = require('../../Utils/textToHashed');
const sendEmail = require('../../Utils/sendEmail');
const Category = require('../../models/Category');
const PurchasedStocks = require('../../models/PurchasedStocks');
const BuyPayments = require('../../models/BuyPayments');
const { v4: uuidv4 } = require('uuid');
const SoldStocks = require('../../models/SoldStocks');
const SellPayments = require('../../models/SellPayments');
const comparePasswords = require('../../Utils/comparePassword');

const getCatergoriesObject = async () => {
  try {
    let refMap = {};

    const allCat = await Category.find();

    allCat.map((eachCat) => {
      refMap[eachCat._id] = eachCat.name;
    });

    return refMap;
  } catch (err) {
    return { success: false };
  }
};

const registerAdmin = async (req, res) => {
  const { name, email, password, phoneNo } = req.body.data;
  const emailDomain = req.headers.host;

  try {
    const finAdmin = await Admin.findOne({ email });
    if (finAdmin) {
      res.status(405).json({
        success: false,
        error: 'Admin with specified email already exist!',
      });
      return;
    } else {
      const hashedPassword = textToHash(password);
      const emailVerificationToken = crypto.randomBytes(65).toString('hex');
      const isVerified = false;

      const createdAdmin = await Admin.create({
        name,
        email,
        password: hashedPassword,
        phoneNo,
        emailToken: crypto
          .createHash('sha256')
          .update(emailVerificationToken)
          .digest('hex'),
        emailTokenExpire: Date.now() + 5 * (60 * 1000),
        isVerified,
      });

      const verificationUrl = `http://${emailDomain}/api/admin/verify-email/${emailVerificationToken}`;

      const message = `
        <h1>Email Verification<h1>
        <p>Please go to the link or copy the link</p>
        <a href=${verificationUrl} clicktracking=off>Verify Email</a>
      `;

      try {
        sendEmail({
          to: email,
          subject: 'Email Verification',
          text: message,
        });
      } catch (err) {
        createdAdmin.emailToken = null;
        createdAdmin.isVerified = false;
        throw err;
      }

      res
        .status(201)
        .json({ success: true, message: 'Admin created successfully!' });
    }
  } catch (err) {
    log.info(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body.data;

  try {
    const findAdmin = await Admin.findOne({ email });

    if (!findAdmin) {
      res
        .status(404)
        .json({ success: false, error: 'No admin with given email exists!' });
      return;
    }

    const matchPassword = comparePasswords(password, findAdmin.password);

    if (!matchPassword) {
      res.status(400).json({
        success: false,
        error: 'Wrong credentials entered!',
      });
      return;
    }

    req.session.isAuth = true;
    req.session.bearerToken = process.env.ADMIN_TOKEN;

    res.status(200).json({
      success: true,
      message: 'Admin logged in successfully!',
    });
  } catch (err) {
    log.info(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const logoutAdmin = async (req, res) => {
  try {
    req.session.destroy((e) => {
      if (e) {
        throw e;
      }
      res.status(200).json({
        success: true,
        message: 'Admin logged out successfully!',
      });
    });
  } catch (err) {
    log.info(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const verifyEmail = async (req, res) => {
  const { email } = req.query;

  const emailDomain = req.headers.host;
  const emailVerificationToken = crypto.randomBytes(65).toString('hex');

  try {
    const verificationUrl = `http://${emailDomain}/api/admin/verify-email/${emailVerificationToken}`;

    const updateAdmin = await Admin.findOneAndUpdate(
      { email },
      {
        $set: {
          emailToken: crypto
            .createHash('sha256')
            .update(emailVerificationToken)
            .digest('hex'),
          emailTokenExpire: Date.now() + 5 * (60 * 1000),
        },
      }
    );

    const message = `
        <h1>Email Verification<h1>
        <p>Please go to the link or copy the link</p>
        <a href=${verificationUrl} clicktracking=off>Verify Email</a>
      `;

    try {
      sendEmail({
        to: email,
        subject: 'Email Verification',
        text: message,
      });
    } catch (err) {
      createdAdmin.emailToken = null;
      createdAdmin.isVerified = false;
      throw err;
    }

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully!',
    });
  } catch (err) {
    log.info(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const verifyAdmin = async (req, res) => {
  const verifyEmailToken = crypto
    .createHash('sha256')
    .update(req.params.emailToken)
    .digest('hex');

  try {
    const result = await Admin.findOne({
      emailToken: verifyEmailToken,
    });

    if (!result) {
      res.status(400).json({ success: false, error: 'No such Admin exists!' });
      return;
    }

    const findAdmin = await Admin.findOne({
      emailToken: verifyEmailToken,
      emailTokenExpire: { $gt: Date.now() },
    });

    if (!findAdmin) {
      res.status(400).json({ success: false, error: 'Token Expired!' });
      return;
    }

    findAdmin.emailToken = null;
    findAdmin.emailTokenExpire = undefined;
    findAdmin.isVerified = true;

    findAdmin.save();

    res.status(200).json({
      success: true,
      message: 'Admins email verified successfully!',
    });
  } catch (err) {
    log.info(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const createNewCategory = async (req, res) => {
  const { category } = req.body.data;

  try {
    let stockCat = category.substr(0, 1).toUpperCase();
    let remainingCat = category.substr(1, category.length).toLowerCase();
    stockCat = stockCat + remainingCat;

    const findCat = await Category.findOne({ name: stockCat });

    if (findCat) {
      res.status(200).json({
        success: true,
        message: 'Category already exists!',
        data: findCat,
      });
      return;
    } else {
      const createdCat = await Category.create({ name: stockCat });
      res.status(201).json({
        success: true,
        message: 'Category created successfully!',
        data: createdCat,
      });
      return;
    }
  } catch (err) {
    log.info(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const addNewStock = async (req, res, next) => {
  const {
    name,
    category,
    seller,
    amount,
    quantity,
    paymentMode,
    transactionId,
  } = req.body.data;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    let stockCat = category.substr(0, 1).toUpperCase();
    let remainingCat = category.substr(1, category.length).toLowerCase();
    stockCat = stockCat + remainingCat;

    let categoryId;
    let findCat = await Category.findOne({ name: stockCat }).session(session);

    if (!findCat) {
      findCat = await Category.create([{ name: stockCat }], { session });
      categoryId = findCat[0]._id;
    } else {
      categoryId = findCat._id;
    }

    const stockId = uuidv4();

    const newStock = await PurchasedStocks.create(
      [
        {
          stockId,
          name,
          category: categoryId,
          seller,
          datePurchased: Date.now(),
          amount,
          quantity,
        },
      ],
      { session }
    );

    const currentStock = await Stock.create(
      [
        {
          stockId,
          name,
          category: categoryId,
          seller,
          datePurchased: Date.now(),
          amount,
          quantity,
        },
      ],
      { session }
    );

    const buyStockPayment = await BuyPayments.create(
      [
        {
          name,
          paymentMode,
          transactionId,
          category: categoryId,
          stockReference: newStock[0]._id,
          paymentDate: Date.now(),
          amount,
          quantity,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: 'Stock created successfully!',
      data: newStock[0],
    });
  } catch (err) {
    await session.abortTransaction();
    log.info(err);
    res.status(500).json({ success: false, error: err.message });
  }
  await session.endSession();
};

const updateStock = async (req, res) => {
  const { dataToUpdate, stockId } = req.body.data;
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const findStock = await Stock.findOne({ stockId }).session(session);

    if (!findStock) {
      res
        .status(400)
        .json({ success: false, error: 'No such stock with this id exists!' });
      return;
    } else {
      const findStockPurchased = await PurchasedStocks.findOne({
        stockId,
      }).session(session);

      const stockMid = findStockPurchased._id.toString();
      const findStockBill = await BuyPayments.findOne({
        stockReference: stockMid,
      }).session(session);

      const updatedStock = await Stock.findOneAndUpdate(
        { stockId },
        { $set: dataToUpdate },
        { new: true }
      ).session(session);

      const updateStockPurchased = await PurchasedStocks.findOneAndUpdate(
        { stockId },
        { $set: dataToUpdate },
        { new: true }
      ).session(session);

      const updateStockBill = await BuyPayments.findByIdAndUpdate(
        findStockBill._id.toString(),
        { $set: dataToUpdate },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Stock details updated successfully!',
        data: updatedStock,
      });

      await session.commitTransaction();
    }
  } catch (err) {
    await session.abortTransaction();
    log.info(err);
    res.status(500).json({ success: false, error: err.message });
  }

  await session.endSession();
};

const sellStock = async (req, res) => {
  // Create seller in Bill
  const { stockId, amount, quantity, paymentMode, transactionId, customer } =
    req.body.data;

  const session = await mongoose.startSession();

  try {
    await session.startTransaction();
    const findStock = await Stock.findOne({ stockId }).session(session);

    let createSoldStock;

    if (quantity > findStock.quantity) {
      throw new Error('Not enough quantity available!');
    } else if (quantity < findStock.quantity) {
      let stockClone = findStock;
      let remainingStock = findStock.quantity - quantity;

      const updatedStock = await Stock.findOneAndUpdate(
        { stockId },
        { $set: { quantity: remainingStock } },
        { new: true }
      ).session(session);

      createSoldStock = await SoldStocks.create(
        [
          {
            stockId,
            name: findStock.name,
            category: findStock.category,
            customer: customer,
            dateSold: Date.now(),
            amount,
            quantity,
          },
        ],
        { session }
      );

      const updateStockBill = await SellPayments.create(
        [
          {
            name: findStock.name,
            paymentMode,
            transactionId,
            category: findStock.category,
            stockReference: createSoldStock[0]._id.toString(),
            paymentDate: Date.now(),
            amount,
            quantity,
          },
        ],
        { session }
      );
    } else {
      createSoldStock = await SoldStocks.create(
        [
          {
            stockId,
            name: findStock.name,
            category: findStock.category,
            customer: customer,
            dateSold: Date.now(),
            amount,
            quantity,
          },
        ],
        { session }
      );

      const updateStockBill = await SellPayments.create(
        [
          {
            name: findStock.name,
            paymentMode,
            transactionId,
            category: findStock.category,
            stockReference: createSoldStock[0]._id.toString(),
            paymentDate: Date.now(),
            amount,
            quantity,
          },
        ],
        { session }
      );

      const deletedStock = await Stock.findOneAndRemove({ stockId }).session(
        session
      );
    }

    res.status(200).json({
      success: true,
      message: 'Stock Sold successfully!',
      data: createSoldStock,
    });

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    log.info(err);
    res.status(500).json({ success: false, error: err.message });
  }

  await session.endSession();
};

const getStockByCategory = async (req, res) => {
  try {
    let finalRes = {};
    let refMap = {};

    const allCat = await Category.find();

    // console.log(allCat);

    allCat.map((eachCat) => {
      finalRes[eachCat.name] = [];
      refMap[eachCat._id] = eachCat.name;
    });

    // console.log(finalRes);

    const allStocks = await Stock.find();

    allStocks.map((eachEle) => {
      // console.log(eachEle.category.toString());
      finalRes[refMap[eachEle.category.toString()]].push(eachEle);
    });

    // console.log(refMap);

    let returnObj = {
      categories: refMap,
      mainData: finalRes,
    };

    res.status(200).json({
      success: true,
      message: 'All Stocks fetched successfully!',
      data: returnObj,
    });
  } catch (err) {
    log.info(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const getPurchasedStocks = async (req, res) => {
  try {
    const categories = await getCatergoriesObject();

    if (categories.success === false)
      throw new Error('Categories not fetched successfully!');

    const purchasedStocks = await PurchasedStocks.find();

    let returnObj = {
      categories,
      mainData: purchasedStocks,
    };

    res.status(200).json({
      success: true,
      message: 'All purchased stocks fetched successfully!',
      data: returnObj,
    });
  } catch (err) {
    log.info(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const getSoldStocks = async (req, res) => {
  try {
    const categories = await getCatergoriesObject();

    if (categories.success === false)
      throw new Error('Categories not fetched successfully!');

    const soldStocks = await SoldStocks.find();

    let returnObj = {
      categories,
      mainData: soldStocks,
    };

    res.status(200).json({
      success: true,
      message: 'All sold stocks fetched successfully!',
      data: returnObj,
    });
  } catch (err) {
    log.info(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const getBuyPayments = async (req, res) => {
  try {
    const categories = await getCatergoriesObject();

    if (categories.success === false)
      throw new Error('Categories not fetched successfully!');

    const buyPayments = await BuyPayments.find().populate([
      'category',
      'stockReference',
    ]);

    let returnObj = {
      categories,
      mainData: buyPayments,
    };

    res.status(200).json({
      success: true,
      message: 'All payments made fetched successfully!',
      data: returnObj,
    });
  } catch (err) {
    log.info(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const getSellPayments = async (req, res) => {
  try {
    const categories = await getCatergoriesObject();

    if (categories.success === false)
      throw new Error('Categories not fetched successfully!');

    const sellPayments = await SellPayments.find().populate([
      'category',
      'stockReference',
    ]);

    let returnObj = {
      categories,
      mainData: sellPayments,
    };

    res.status(200).json({
      success: true,
      message: 'All payments recieved fetched successfully!',
      data: returnObj,
    });
  } catch (err) {
    log.info(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
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
};
