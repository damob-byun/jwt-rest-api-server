const router = require('express').Router();
const { commentController: controller } = require('../controllers');

router.get('/:commentId([\\d]+)?', controller.comment);
router.post('/', controller.create);
router.put('/', controller.update);
router.delete('/', controller.delete);

module.exports = router;