// userRouter da rotalarımızı oluşturduk. Şimdi bu rotalara gelen
//istekleri ele alacak ve mongoosedaki metotları kullanabileceğimiz
// modelleri oluşturmamız gerek.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('@hapi/joi');
var createError = require('http-errors');
const jwt = require('jsonwebtoken');

const GroupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    members: {
      type: Array,
      required: true,
    },
  },
  { collection: 'Groups', timestamps: true }
);
const schema = Joi.object({
  name: Joi.string().trim(),
  members: Joi.array(),
});

//yeni bir user için:
GroupSchema.methods.joiValidation = function (groupObject) {
  schema.required();
  return schema.validate(groupObject);
};
GroupSchema.statics.joiValidationForUpdate = function (groupObject) {
  return schema.validate(groupObject);
};

GroupSchema.methods.toJSON = function () {
  const group = this.toObject();
  //delete user._id;
  delete group.createdAt;
  delete group.updatedAt;
  delete group.__v;
  //this, o an üzerinde çalışılan user'ı bana ver demek.
  //burada delete, yanında yazılanı kullanıcıya göstermememizi sağlar.
  return group;
};

const Group = mongoose.model('Group', GroupSchema);
module.exports = Group;
