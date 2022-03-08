const Group = require('../models/groupModel');
var createError = require('http-errors');

const listAllGroups = async (req, res) => {
  const data = await Group.find({});
  res.json({ data });
};

const updateGroup = async (req, res, next) => {
  delete req.body.createAt;
  delete req.body.updatedAt;
  const { error, value } = User.joiValidationForUpdate(req.body);
  if (error) {
    next(createError(400, error));
  } else {
    try {
      const result = await User.findByIdAndUpdate({ _id: req.group.id }, req.body, {
        new: true,
        runValidators: true,
      });
      if (result) {
        return res.json(result);
      } else {
        return res.status(404).json({
          message: 'Group güncellenemedi.',
        });
      }
    } catch (e) {
      next(e);
    }
  }
};

const addGroup = async (req, res, next) => {
  try {
    const newGroup = new Group(req.body);
    const { error, value } = newGroup.joiValidation(req.body);
    if (error) {
      next(createError(400, error));
    } else {
      const result = await newGroup.save();
      res.json(result);
    }
  } catch (e) {
    next(e);
  }
};

const deleteGroupById = async (req, res, next) => {
  try {
    const result = await Message.findByIdAndDelete({
      _id: req.params.id,
    });
    if (result) {
      res.json({
        message: 'Group silindi.',
      });
    } else {
      res.json({
        message: 'Group silinemedi / bulunamadı.',
      });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  listAllGroups,
  updateGroup,
  addGroup,
  deleteGroupById,
};
