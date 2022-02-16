// userRouter da rotalarımızı oluşturduk. Şimdi bu rotalara gelen
//istekleri ele alacak ve mongoosedaki metotları kullanabileceğimiz
// modelleri oluşturmamız gerek.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('@hapi/joi');
var createError = require('http-errors');
const bcrypt = require('bcrypt');

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    surname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { collection: 'Users', timestamps: true }
);
const schema = Joi.object({
  name: Joi.string().min(3).max(50).trim(),
  surname: Joi.string().min(2).max(50).trim(),
  email: Joi.string().trim().email(),
  password: Joi.string().trim(),
});

//yeni bir user için:
UserSchema.methods.joiValidation = function (userObject) {
  schema.required();
  return schema.validate(userObject);
};

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user._id;
  delete user.createdAt;
  delete user.updatedAt;
  delete user.__v;
  delete user.password;
  //this, o an üzerinde çalışılan user'ı bana ver demek.
  //burada delete, yanında yazılanı kullanıcıya göstermememizi sağlar.
  return user;
};

UserSchema.statics.beLogin = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(400, 'Email ya da şifre hatalı!');
  }
  const pswCheck = await bcrypt.compare(password, user.password);
  //password kullanıcıdan gelir, user.password ise veritabanından.

  if (!pswCheck) {
    throw createError(400, 'Email ya da şifre hatalı!');
  }

  return user;
};

//update için:
UserSchema.statics.joiValidationForUpdate = function (userObject) {
  return schema.validate(userObject);
  //required kullanamayız çünkü her zaman name, surname, email ve passwordü birlikte güncellemeyebiliriz. Sadece name güncellemeye çalıştığımızda diğerlerinde required yazarsa hata alırız.
};
//static cünkü biz bu metodu sınıf üzerinden çağırıyoruz, nesne üzerinden değil.

const User = mongoose.model('User', UserSchema);
module.exports = User;
