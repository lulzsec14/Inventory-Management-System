const log = require('../Utils/Logger');

const checkAdmin = (req, res, next) => {
  try {
    if (
      req.session.isAuth &&
      req.session.bearerToken === process.env.ADMIN_TOKEN
    ) {
      next();
    } else {
      res.status(401).json({
        success: false,
        error: 'Not authorized to perform this operation!',
      });
    }
  } catch (err) {
    log.info(err);
    res.status(500).json({ success: false, error: err });
  }
};

module.exports = { checkAdmin };
