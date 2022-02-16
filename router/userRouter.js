const User = require('../models/userModel');
const router = require('express').Router();
var createError = require('http-errors');
const bcrypt = require('bcrypt');

// sadece '/' koyduğumuzda burası 'api/users' anlamına gelir.
router.get('/', async (req, res) => {
  const data = await User.find({});
  res.json({ data });
});

router.get('/:id', (req, res, next) => {
  res.json({
    message: 'idsi ' + req.params.id + ' olan user listelenecek.',
  });
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
    res.json(user);
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

router.delete('/:id', async (req, res, next) => {
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

module.exports = router;
