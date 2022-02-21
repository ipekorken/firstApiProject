const admin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      message: 'Erişim için yeterli yetkiniz yok.',
    });
  }
  next();
};

module.exports = admin;
