const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('@hapi/joi');
var createError = require('http-errors');

const MessageSchema = new Schema(
  {
    groupId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
  },
  { collection: 'Messages', timestamps: true }
);
const schema = Joi.object({
  groupId: Joi.string(),
  userId: Joi.string(),
  message: Joi.string(),
});

//yeni bir user için:
MessageSchema.methods.joiValidation = function (messageObject) {
  schema.required();
  return schema.validate(messageObject);
};

MessageSchema.methods.toJSON = function () {
  const message = this.toObject();
  //delete user._id;
  delete message.createdAt;
  delete message.updatedAt;
  delete message.__v;
  //this, o an üzerinde çalışılan user'ı bana ver demek.
  //burada delete, yanında yazılanı kullanıcıya göstermememizi sağlar.
  return message;
};

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
