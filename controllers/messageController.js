const Message = require('../models/messageModel');
var createError = require('http-errors');

const listAllMessages = async (req, res) => {
  const data = await Message.find({});
  res.json({ data });
};

const sendMessage = async (req, res, next) => {
  try {
    const newMessage = new Message(req.body);
    const { error, value } = newMessage.joiValidation(req.body);
    if (error) {
      next(createError(400, error));
    } else {
      const result = await newMessage.save();
      res.json(result);
    }
  } catch (e) {
    next(e);
  }
};

const deleteMessageById = async (req, res, next) => {
  try {
    const result = await Message.findByIdAndDelete({
      _id: req.params.id,
    });
    if (result) {
      res.json({
        message: 'Mesaj silindi.',
      });
    } else {
      res.json({
        message: 'Mesaj silinemedi / bulunamadı.',
      });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  listAllMessages,
  sendMessage,
  deleteMessageById,
};
