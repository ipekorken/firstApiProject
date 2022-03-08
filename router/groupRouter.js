const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const groupController = require('../controllers/groupController');

router.get('/', authMiddleware, groupController.listAllGroups);

router.patch('/updateGroup', authMiddleware, groupController.updateGroup);

router.post('/addGroup', groupController.addGroup);

router.delete('/:id', authMiddleware, groupController.deleteGroupById);
module.exports = router;
