const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const result = jwt.verify(token, 'secretkey');

    req.user = await User.findById({ _id: result._id });

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
