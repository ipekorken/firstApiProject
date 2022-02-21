const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const result = jwt.verify(token, 'secretkey');

    //admin kendini sildikten sonra çıkan hata logları için:
    const selectedUser = await User.findById({ _id: result._id });
    if (selectedUser) {
      req.user = selectedUser;
    } else {
      throw new Error('Lütfen giriş yapın');
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
