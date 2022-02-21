const User = require('../models/userModel');
const router = require('express').Router();
var createError = require('http-errors');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// sadece '/' koyduğumuzda burası 'api/users' anlamına gelir.
router.get('/', [authMiddleware, adminMiddleware], async (req, res) => {
  const data = await User.find({});
  res.json({ data });
});

router.get('/userInfo', authMiddleware, (req, res, next) => {
  res.json(req.user);
});

router.patch('/update', authMiddleware, async (req, res, next) => {
  delete req.body.createAt;
  delete req.body.updatedAt;
  if (req.body.hasOwnProperty('password')) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }
  const { error, value } = User.joiValidationForUpdate(req.body);
  if (error) {
    next(createError(400, error));
  } else {
    try {
      const result = await User.findByIdAndUpdate({ _id: req.user.id }, req.body, {
        new: true,
        runValidators: true,
      });
      if (result) {
        return res.json(result);
      } else {
        return res.status(404).json({
          message: 'User güncellenemedi.',
        });
      }
    } catch (e) {
      next(e);
    }
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    newUser.password = await bcrypt.hash(newUser.password, 10);
    const { error, value } = newUser.joiValidation(req.body);
    if (error) {
      next(createError(400, error));
    } else {
      const result = await newUser.save();
      res.json(result);
    }
  } catch (e) {
    next(e);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.beLogin(req.body.email, req.body.password);
    const token = await user.generateToken();
    res.json({ user, token });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  delete req.body.createAt;
  delete req.body.updatedAt;
  // bunları herhangi biri kod üzerinden değiştiremesin diye yazdık.

  if (req.body.hasOwnProperty('password')) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }

  //post işlemindeki gibi user nesnesi oluşturmuyoruz. Bu yüzden statik metodlardan yararlanıyoruz.
  const { error, value } = User.joiValidationForUpdate(req.body);
  if (error) {
    next(createError(400, error));
  } else {
    try {
      const result = await User.findByIdAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });
      if (result) {
        return res.json(result);
      } else {
        return res.status(404).json({
          message: 'User güncellenemedi / bulunamadı.',
        });
      }
    } catch (e) {
      next(e);
    }
  }
});

router.delete('/deleteOwnAccount', authMiddleware, async (req, res, next) => {
  try {
    const result = await User.findByIdAndDelete({
      _id: req.user._id,
    });
    if (result) {
      res.json({
        message: 'Hesabınız silindi.',
      });
    } else {
      res.json({
        message: 'Hesabınız silinemedi / bulunamadı.',
      });
    }
    //Eğer else içindeki hatayı da errorMiddleware ile getirmek istersek yazmamız gereken:
    // throw new Error("User silinemedi / bulunamadı.")
    // hata kodu da yazdırmak istersek:
    // const errorObj = new Error("User silinemedi / bulunamadı.")
    // errorObj.errorCode = 404
    // throw errorObj;
    // errorMiddleware'e eklenmesi gereken:
    // res.json ({
    // message: err.message,
    // errorCode: err.errorCode
    // })

    // http-errors sayesinde bu hata kodu olayını nesne oluşturmadan yaparız.
    // throw createError(404, 'User bulunamadı');
  } catch (e) {
    next(e);
    // Eğer hata koduyla birlikte görmek istersek:
    // next(createError(400, e))
  }
});

router.delete('/:id', [authMiddleware, adminMiddleware], async (req, res, next) => {
  try {
    const result = await User.findByIdAndDelete({
      _id: req.params.id,
    });
    if (result) {
      res.json({
        message: 'User silindi.',
      });
    } else {
      res.json({
        message: 'User silinemedi / bulunamadı.',
      });
    }
    //Eğer else içindeki hatayı da errorMiddleware ile getirmek istersek yazmamız gereken:
    // throw new Error("User silinemedi / bulunamadı.")
    // hata kodu da yazdırmak istersek:
    // const errorObj = new Error("User silinemedi / bulunamadı.")
    // errorObj.errorCode = 404
    // throw errorObj;
    // errorMiddleware'e eklenmesi gereken:
    // res.json ({
    // message: err.message,
    // errorCode: err.errorCode
    // })

    // http-errors sayesinde bu hata kodu olayını nesne oluşturmadan yaparız.
    // throw createError(404, 'User bulunamadı');
  } catch (e) {
    next(e);
    // Eğer hata koduyla birlikte görmek istersek:
    // next(createError(400, e))
  }
});

//Bunu önce delete ile yaptık ama herhangi bir id vermiyor oluşumuz sorun çıkarttı. Get kullanmak daha sağlıklı.
router.get('/deleteAll', [authMiddleware, adminMiddleware], async (req, res, next) => {
  try {
    const result = await User.deleteMany({
      isAdmin: false,
    });
    if (result) {
      res.json({
        message: 'Tüm kullanıcılar silindi.',
      });
    } else {
      res.json({
        message: 'Kullanıcılar silinemedi / bulunamadı.',
      });
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
