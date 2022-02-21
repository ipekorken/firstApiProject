const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const userController = require('../controllers/userController');

// sadece '/' koyduğumuzda burası 'api/users' anlamına gelir.
router.get('/', [authMiddleware, adminMiddleware], userController.listAllUsers);

router.get('/userInfo', authMiddleware, userController.getUserInfo);

router.patch('/update', authMiddleware, userController.updateUser);

router.post('/register', userController.register);

router.post('/login', userController.login);

// router.patch('/:id', async (req, res, next) => {
//   delete req.body.createAt;
//   delete req.body.updatedAt;
//   // bunları herhangi biri kod üzerinden değiştiremesin diye yazdık.

//   if (req.body.hasOwnProperty('password')) {
//     req.body.password = await bcrypt.hash(req.body.password, 10);
//   }

//   //post işlemindeki gibi user nesnesi oluşturmuyoruz. Bu yüzden statik metodlardan yararlanıyoruz.
//   const { error, value } = User.joiValidationForUpdate(req.body);
//   if (error) {
//     next(createError(400, error));
//   } else {
//     try {
//       const result = await User.findByIdAndUpdate({ _id: req.params.id }, req.body, {
//         new: true,
//         runValidators: true,
//       });
//       if (result) {
//         return res.json(result);
//       } else {
//         return res.status(404).json({
//           message: 'User güncellenemedi / bulunamadı.',
//         });
//       }
//     } catch (e) {
//       next(e);
//     }
//   }
// });

router.delete('/deleteOwnAccount', authMiddleware, userController.deleteOwnAccount);

router.delete('/:id', [authMiddleware, adminMiddleware], userController.deleteUserById);

//Bunu önce delete ile yaptık ama herhangi bir id vermiyor oluşumuz sorun çıkarttı. Get kullanmak daha sağlıklı.
router.get('/deleteAll', [authMiddleware, adminMiddleware], userController.deleteAllUser);

module.exports = router;
