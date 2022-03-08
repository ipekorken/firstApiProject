const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const messageController = require('../controllers/messageController');

router.get('/', authMiddleware, messageController.listAllMessages);
router.post('/sendMessage', messageController.sendMessage);
router.delete('/:id', authMiddleware, messageController.deleteMessageById);
module.exports = router;
